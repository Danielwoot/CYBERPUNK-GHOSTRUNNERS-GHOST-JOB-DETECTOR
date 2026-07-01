const fetchFelo = async () => {
  try {
    const res = await fetch('https://felo.ai/search');
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
};
fetchFelo();
