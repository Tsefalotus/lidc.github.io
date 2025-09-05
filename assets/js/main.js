document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".lazy-video");
  
    const observerOptions = {
      root: null, // Отслеживаем относительно viewport
      threshold: 0.5 // 50% элемента должно быть видно
    };
  
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
  
        if (entry.isIntersecting) {
          // Если видео пересекает 50% экрана, воспроизводим его
          console.log("Playing video:", video);
          video.play();
        } else {
          // Если видео выходит из зоны видимости, ставим на паузу
          console.log("Pausing video:", video);
          video.pause();
        }
      });
    }, observerOptions);
  
    // Наблюдаем за каждым видео
    videos.forEach((video) => {
      videoObserver.observe(video);
    });
  });
  