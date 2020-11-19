const getTimeRemaining = (endTime: number) => {
  const total = endTime - Date.now();
  const hours = Math.floor(total / 1000 / 3600);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);

  return {
    total,
    hours,
    minutes,
    seconds,
  };
};

export default getTimeRemaining;
