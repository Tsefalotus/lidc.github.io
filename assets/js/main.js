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
    threshold: 0.5,
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        console.log("Playing video:", video);
        video.play();
      } else {
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

    // Возобновляем воспроизведение видео-превью, если оно было
    if (currentVideoPreview) {
      console.log("Resuming video preview:", currentVideoPreview);
      currentVideoPreview.play();
      currentVideoPreview = null; // Сбрасываем переменную
    }
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      iframe.src = ""; // Очищаем src, чтобы остановить видео

      // Возобновляем воспроизведение видео-превью, если оно было
      if (currentVideoPreview) {
        console.log("Resuming video preview:", currentVideoPreview);
        currentVideoPreview.play();
        currentVideoPreview = null; // Сбрасываем переменную
      }
    }
  });
});