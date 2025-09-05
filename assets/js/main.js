document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".lazy-video");
  const modal = document.getElementById("youtube-modal");
  const iframe = document.getElementById("youtube-iframe");
  const closeModal = document.querySelector(".close-modal");
  const openModalLinks = document.querySelectorAll(".open-modal");

  let currentVideoPreview = null; // Переменная для хранения текущего видео-превью

  // Наблюдатель для видео-превью
  const observerOptions = {
    root: null,
    threshold: 0.5, // 50% элемента должно быть видно
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

  // Открытие модального окна
  openModalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Получаем идентификатор видео из data-video-id
      const videoId = this.getAttribute("data-video-id");
      if (!iframe) {
        console.error("Iframe with ID 'youtube-iframe' not found");
        return;
      }

      // Ставим на паузу видео-превью
      const videoPreview = this.querySelector("video");
      if (videoPreview) {
        console.log("Pausing video preview:", videoPreview);
        videoPreview.pause();
        currentVideoPreview = videoPreview; // Сохраняем текущее видео-превью
      }

      // Устанавливаем src для iframe с параметрами autoplay=1 и mute=1
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      modal.style.display = "flex"; // Показываем модальное окно
    });
  });

  // Закрытие модального окна
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    iframe.src = ""; // Очищаем src, чтобы остановить видео

    // Возобновляем воспроизведение только для видео, которые видны на 50% экрана
    videos.forEach((video) => {
      videoObserver.unobserve(video); // Сначала убираем наблюдение
      videoObserver.observe(video); // Затем снова добавляем наблюдение
    });
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      iframe.src = ""; // Очищаем src, чтобы остановить видео

      // Возобновляем воспроизведение только для видео, которые видны на 50% экрана
      videos.forEach((video) => {
        videoObserver.unobserve(video); // Сначала убираем наблюдение
        videoObserver.observe(video); // Затем снова добавляем наблюдение
      });
    }
  });
});