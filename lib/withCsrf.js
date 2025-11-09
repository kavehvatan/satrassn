const CSRF_HEADER='x-csrf-token';
export function getServerCsrfToken(){
  return process.env.CSRF_STATIC_SECRET || process.env.NEXT_PUBLIC_CSRF_STATIC_SECRET || 'satrass-csrf-dev';
}
export default function withCsrf(handler){
  return async (req,res)=>{
    if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
      const tok=(req.headers[CSRF_HEADER]||'').toString();
      if(!tok || tok!==getServerCsrfToken()){ res.status(403).json({ok:false,error:'Invalid CSRF token'}); return; }
    }
    return handler(req,res);
  };
}