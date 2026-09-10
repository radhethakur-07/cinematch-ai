import logging
import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger("cinematch-ai")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()
        
        logger.info(f"[{request_id}] START {request.method} {request.url.path}")
        
        try:
            response: Response = await call_next(request)
            duration_ms = int((time.time() - start_time) * 1000)
            logger.info(f"[{request_id}] COMPLETED {request.method} {request.url.path} - Status: {response.status_code} ({duration_ms}ms)")
            response.headers["X-Request-ID"] = request_id
            return response
        except Exception as ex:
            duration_ms = int((time.time() - start_time) * 1000)
            logger.error(f"[{request_id}] FAILED {request.method} {request.url.path} - {ex} ({duration_ms}ms)", exc_info=True)
            from fastapi.responses import JSONResponse
            origin = request.headers.get("origin", "*")
            return JSONResponse(
                status_code=500,
                headers={
                    "Access-Control-Allow-Origin": origin if origin else "*",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "X-Request-ID": request_id,
                },
                content={
                    "success": False,
                    "error": {
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": str(ex),
                        "details": {}
                    }
                }
            )
