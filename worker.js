export default {
  async fetch(request, env) {

    const username = env.API_USERNAME;
    const password = env.API_PASSWORD;

    const auth = btoa(`${username}:${password}`);

    const response = await fetch(
      "https://api.theracingapi.com/v1/racecards/free",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    return new Response(await response.text(), {
      return new Response(await response.text(), {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type"
  }
});
    });
  }
}