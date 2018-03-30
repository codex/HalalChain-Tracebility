const FakeRequest = (data, delay, error) => new Promise((resolve, reject) => {
  if (error) {
    setTimeout(() => reject(error), delay);
  } else {
    setTimeout(() => resolve(data), delay);
  }
});
export default FakeRequest;