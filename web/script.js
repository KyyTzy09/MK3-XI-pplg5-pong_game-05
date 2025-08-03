// Dummy data menu
const menuItems = [
  {
    name: "Burger Keju",
    desc: "Burger daging sapi dengan keju leleh dan saus spesial.",
    img: "https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg"
  },
  {
    name: "Hotdog Jumbo",
    desc: "Hotdog sosis jumbo dengan topping saus tomat dan mustard.",
    img: "https://img.freepik.com/premium-photo/hot-dog-with-grilled-sausage-tomato-lettuce-dark-background-american-hotdog-top-view-overhead_2829-21615.jpg"
  },
  {
    name: "Pizza Pepperoni",
    desc: "Pizza tipis renyah dengan topping pepperoni dan keju mozzarella.",
    img: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg"
  }
];

// Render menu cards
const menuContainer = document.getElementById('menu-container');
menuItems.forEach(item => {
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
  `;
  menuContainer.appendChild(card);
});

// Komentar
const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comment-list');

// Ambil komentar dari localStorage
function loadComments() {
  const comments = JSON.parse(localStorage.getItem('comments')) || [];
  commentList.innerHTML = '';
  comments.forEach(c => {
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `<strong>${c.name}</strong><p>${c.text}</p>`;
    commentList.appendChild(card);
  });
}

// Simpan komentar ke localStorage
commentForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const text = document.getElementById('comment').value.trim();

  if (name && text) {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push({ name, text });
    localStorage.setItem('comments', JSON.stringify(comments));

    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
    loadComments();
  }
});

// Load pertama
loadComments();
