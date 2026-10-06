// Load one privacy-enhanced player only after an explicit click.
document.querySelectorAll('.social-player').forEach(player => {
  const button = player.querySelector('button');
  button?.addEventListener('click', () => {
    const id = player.dataset.video;
    if (!/^[\w-]{11}$/.test(id || '')) return;
    document.querySelectorAll('.social-player iframe').forEach(frame => {
      const other = frame.parentElement;
      frame.remove();
      other.querySelector('button').hidden = false;
      other.querySelector('img').hidden = false;
    });
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    frame.title = button.getAttribute('aria-label');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.hidden = true;
    player.querySelector('img').hidden = true;
    player.append(frame);
    frame.focus();
  });
});
