import {
  updateHistoryList,
  // loadHistoryFromStorage,
  saveToHistory,
} from "./history";

describe("history", () => {
  let mockHistory, mockHistoryLimit, list, item, items;

  beforeEach(() => {
    mockHistory = [
      {
        name: "test",
      },
      {
        name: "test2",
      },
    ];

    mockHistoryLimit = [
      {
        name: "test",
      },
      {
        name: "test2",
      },
      {
        name: "test3",
      },
      {
        name: "test4",
      },
      {
        name: "test5",
      },
      {
        name: "test6",
      },
      {
        name: "test7",
      },
      {
        name: "test8",
      },
      {
        name: "test9",
      },
      {
        name: "test10",
      },
    ];

    document.body.innerHTML = `
      <ul class="history__list"></ul>
      `;
    jest.spyOn(document, "createElement");
    list = document.querySelector(".history__list");

    mockHistory.forEach((el) => {
      item = document.createElement("li");
      item.dataset.city = el.name;
      item.textContent = el.name;

      list.append(item);
    });
    items = list.querySelectorAll("li");

    jest.spyOn(window.localStorage.__proto__, "setItem");
    jest.spyOn(window.localStorage.__proto__, "getItem");
    jest.spyOn(window.localStorage.__proto__, "clear");
  });

  it("updateHistoryList", () => {
    updateHistoryList(mockHistory);
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("test");
    expect(items[1].textContent).toBe("test2");
  });

  it("saveToHistory - get items", () => {
    saveToHistory(mockHistory);
    const saveHistory = JSON.parse(localStorage.getItem("list")) || [];
    expect(JSON.stringify(saveHistory)).toBe(JSON.stringify([mockHistory]));
  });

  it("saveToHistory > 10 items", () => {
    saveToHistory(mockHistoryLimit);
    const saveHistory = JSON.parse(localStorage.getItem("list")) || [];
    expect(JSON.stringify(saveHistory)).toBe(
      JSON.stringify([mockHistoryLimit]),
    );
  });
});
