export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*', // 建议实际项目中换成具体的来源
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  const method = event.node.req.method;
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
});
