const MAX_HISTORY_ITEMS = 10;

export const updateHistoryList = (listHistory) => {
  const list = document.querySelector(".history__list");
  list.innerHTML = "";

  listHistory.forEach((elem) => {
    const listItem = document.createElement("li");
    listItem.textContent = elem.name;
    listItem.dataset.city = elem.name;
    list.appendChild(listItem);
  });
};

export const loadHistoryFromStorage = () => {
  const ls = localStorage.getItem("list");
  if (ls) {
    const listHistory = new Set(JSON.parse(ls));
    updateHistoryList(listHistory);
    return listHistory;
  }
  return new Set();
};

export const saveToHistory = (cityData) => {
  const listHistory = JSON.parse(localStorage.getItem("list")) || [];

  const existingIndex = listHistory.findIndex(
    (item) => item.name === cityData.name,
  );
  if (existingIndex !== -1) {
    listHistory.splice(existingIndex, 1);
  }

  listHistory.push(cityData);
  if (listHistory.length > MAX_HISTORY_ITEMS) {
    listHistory.shift();
  }

  localStorage.setItem("list", JSON.stringify(listHistory));
  updateHistoryList(listHistory);
};
