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

  // Обработчик кликов на "View full video"
  document.querySelectorAll('.view-full-video').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      // Получаем ID видео из data-video-id
      const videoId = button.dataset.videoId;

      if (!iframe) {
        console.error("Iframe with ID 'youtube-iframe' not found");
        return;
      }

      // Устанавливаем ссылку на YouTube-видео
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      modal.style.display = 'block'; // Показываем модальное окно
    });
  });

  // Закрытие модального окна
  closeModal.addEventListener('click', () => {
    if (iframe) {
      iframe.src = ''; // Очищаем src, чтобы остановить видео
    }

    modal.style.display = 'none'; // Скрываем модальное окно
  });
});