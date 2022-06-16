export function ApiPaginateResponse(statusCode, message, data) {
   const {items, meta, links} = data;
   return {
     statusCode: statusCode,
     message: message,
     items: [...items],
     ...meta,
     links
   }
 }