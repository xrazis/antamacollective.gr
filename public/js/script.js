const body = document.body;
const searchWrapper = document.querySelector(".search-wrapper");
const searchModal = document.querySelector(".search-modal");
const searchFooter = document.querySelector(".search-wrapper-footer");
const searchResult = document.querySelectorAll("[data-search-result]");
const searchResultItemTemplate = document.getElementById("search-result-item-template");
const hasSearchWrapper = searchWrapper != null;
const hasSearchModal = searchModal != null;
const searchInput = document.querySelectorAll("[data-search-input]");
const emptySearchResult = document.querySelectorAll(".search-result-empty");
const openSearchModal = document.querySelectorAll('[data-target="search-modal"]');
const closeSearchModal = document.querySelectorAll('[data-target="close-search-modal"]');
const searchIcon = document.querySelector(".search-input-body label svg[data-type='search']");
const searchIconReset = document.querySelector(".search-input-body label svg[data-type='reset']");
const searchResultInfo = document.querySelector(".search-result-info");
let searchModalVisible = hasSearchModal && searchModal.classList.contains("show") ? true : false;
let jsonData = [];

const loadJsonData = async () => {
  try {
    const res = await fetch(indexURL);
    return (jsonData = await res.json());
  } catch (err) {
    console.error(err);
  }
};

if (hasSearchWrapper) {
  // disable enter key on searchInput
  searchInput.forEach((el) => {
    el.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
      }
    });
  });

  // Capitalize First Letter
  const capitalizeFirstLetter = (string) => {
    return string
      .replace(/^[\s_]+|[\s_]+$/g, "")
      .replace(/[_\s]+/g, " ")
      .replace(/^[a-z]/, function (m) {
        return m.toUpperCase();
      });
  };

  // String to URL
  const urlize = (string) => {
    let lowercaseText = string.trim().replace(/[\s_]+/g, '-').toLowerCase();
    return encodeURIComponent(lowercaseText);
  }

  // options
  const image = searchWrapper.getAttribute("data-image");
  const description = searchWrapper.getAttribute("data-description");
  const tags = searchWrapper.getAttribute("data-tags");
  const categories = searchWrapper.getAttribute("data-categories");

  let searchString = "";

  // get search string from url
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearchString = urlParams.get("s");

  if (urlSearchString !== null) {
    searchString = urlSearchString.replace(/\+/g, " ");
    searchInput.forEach((el) => {
      el.value = searchString;
    });
    searchIcon && (searchIcon.style.display = "none");
    searchIconReset && (searchIconReset.style.display = "initial");
  }

  searchInput.forEach((el) => {
    el.addEventListener("input", (e) => {
      searchString = e.target.value.toLowerCase();
      window.history.replaceState(
        {},
        "",
        `${window.location.origin}${window.location.pathname
        }?s=${searchString.replace(/ /g, "+")}`
      );

      doSearch(searchString);
    });
  });

  // dom content loaded
  document.addEventListener("DOMContentLoaded", async () => {
    await loadJsonData();
    doSearch(searchString);
  });

  // doSearch
  const doSearch = async (searchString) => {
    if (searchString !== "") {
      searchIcon && (searchIcon.style.display = "none");
      searchIconReset && (searchIconReset.style.display = "initial");
      emptySearchResult.forEach((el) => {
        el.innerHTML = `<div class="search-not-found">
        <svg width="42" height="42" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.10368 33.9625C9.90104 36.2184 13.2988 37.6547 16.9158 38.0692C21.6958 38.617 26.5063 37.3401 30.3853 34.4939C30.4731 34.6109 30.5668 34.7221 30.6721 34.8304L41.9815 46.1397C42.5323 46.6909 43.2795 47.0007 44.0587 47.001C44.838 47.0013 45.5854 46.692 46.1366 46.1412C46.6878 45.5904 46.9976 44.8432 46.9979 44.064C46.9981 43.2847 46.6888 42.5373 46.138 41.9861L34.8287 30.6767C34.7236 30.5704 34.6107 30.4752 34.4909 30.3859C37.3352 26.5046 38.6092 21.6924 38.0579 16.912C37.6355 13.2498 36.1657 9.81322 33.8586 6.9977L31.7805 9.09214C34.0157 11.9274 35.2487 15.4472 35.2487 19.0942C35.2487 21.2158 34.8308 23.3167 34.0189 25.2769C33.207 27.2371 32.0169 29.0181 30.5167 30.5184C29.0164 32.0186 27.2354 33.2087 25.2752 34.0206C23.315 34.8325 21.2141 35.2504 19.0925 35.2504C16.9708 35.2504 14.8699 34.8325 12.9098 34.0206C11.5762 33.4682 10.3256 32.7409 9.18992 31.8599L7.10368 33.9625ZM28.9344 6.28152C26.1272 4.12516 22.671 2.93792 19.0925 2.93792C14.8076 2.93792 10.6982 4.64009 7.66829 7.66997C4.6384 10.6999 2.93623 14.8093 2.93623 19.0942C2.93623 21.2158 3.35413 23.3167 4.16605 25.2769C4.72475 26.6257 5.4625 27.8897 6.35716 29.0358L4.2702 31.1391C1.35261 27.548 -0.165546 23.0135 0.00974294 18.3781C0.19158 13.5695 2.18233 9.00695 5.58371 5.60313C8.98509 2.19932 13.5463 0.205307 18.3547 0.0200301C22.9447 -0.156832 27.4369 1.32691 31.0132 4.18636L28.9344 6.28152Z" fill="currentColor"/><path d="M3.13672 39.1367L38.3537 3.64355" stroke="black" stroke-width="3" stroke-linecap="round"/></svg><p>${no_results_for} "<b>${searchString}</b>"</p></div>`;
      });
    } else {
      searchIcon && (searchIcon.style.display = "initial");
      searchIconReset && (searchIconReset.style.display = "none");
      emptySearchResult.forEach((el) => {
        el.innerHTML = empty_search_results_placeholder;
      });
    }

    let filteredJSON = includeSectionsInSearch.map((section) => {
      const data = jsonData.filter(
        (item) => urlize(item.section) === urlize(section)
      );

      const sectionName = section.replace(/[-_]/g, " ");
      return {
        section: capitalizeFirstLetter(sectionName),
        data,
      };
    });

    let searchItem = filteredJSON.filter((item) => {
      if (searchString === "") {
        return false;
      }
      return item.data.some((el) => {
        const regex = new RegExp(searchString, "gi");
        return (
          el.title.toLowerCase().match(regex) ||
          el.description?.toLowerCase().match(regex) ||
          el.searchKeyword.toLowerCase().match(regex) ||
          el.content.toLowerCase().match(regex) ||
          el.tags?.toLowerCase().match(regex) ||
          el.categories?.toLowerCase().match(regex)
        );
      });
    });

    displayResult(searchItem, searchString);

    // Navigate with arrow keys
    if (searchModal && searchString != "") {
      let resItems;
      resItems = searchResult[0].querySelectorAll(".search-result-item");
      let selectedIndex = -1;

      const selectItem = (index) => {
        if (index >= 0 && index < resItems.length) {
          for (let i = 0; i < resItems.length; i++) {
            resItems[i].classList.toggle("search-item-selected", i === index);
          }
          selectedIndex = index;
          resItems[index].scrollIntoView({
            behavior: "auto",
            block: "nearest",
          });
        }
      };

      const handleKeyDown = (event) => {
        if (searchItem.length !== 0) {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();

            if (event.key === "ArrowUp") {
              selectedIndex =
                selectedIndex > 0 ? selectedIndex - 1 : resItems.length - 1;
            } else if (event.key === "ArrowDown") {
              selectedIndex =
                selectedIndex < resItems.length - 1 ? selectedIndex + 1 : 0;
            }

            selectItem(selectedIndex !== -1 ? selectedIndex : -1);
          } else if (event.key === "Enter") {
            event.preventDefault();

            if (selectedIndex !== -1) {
              let selectedLink = resItems[selectedIndex]
                .getElementsByClassName("search-title")[0]
                .getAttribute("href");
              window.location.href = selectedLink;
            }
          }
        }
      };

      searchInput.forEach((el) => {
        el.addEventListener("keydown", handleKeyDown);
      });
      selectItem(-1);
    }
  };

  const displayResult = (searchItems, searchString) => {
    const generateSearchResultHTML = (item) => {
      const contentValue = item.data
        .filter((d) => d.content.toLowerCase().includes(searchString))
        .map((innerItem) => {
          const position = innerItem.content
            .toLowerCase()
            .indexOf(searchString.toLowerCase());
          let matches = innerItem.content.substring(
            position,
            searchString.length + position
          );
          let matchesAfter = innerItem.content.substring(
            searchString.length + position,
            searchString.length + position + 80
          );
          const highlighted = innerItem.content.replace(
            innerItem.content,
            "<mark>" + matches + "</mark>" + matchesAfter
          );
          return highlighted;
        });

      const highlightResult = (content) => {
        const regex = new RegExp(searchString, "gi");
        return content.replace(regex, (match) => `<u>${match}</u>`);
      };
      const highlightResultContent = (content) => {
        const regex = new RegExp(searchString, "gi");
        const matchIndex = content.search(regex);

        if (matchIndex >= 0) {
          const matchedContent = content.slice(matchIndex);
          const lastWord = content.slice(0, matchIndex).split(" ").pop();

          return matchedContent.replace(
            regex,
            (match) => lastWord + `<mark>${match}</mark>`
          );
        }

        return content;
      };

      const filteredItems = item.data.filter(
        (d) =>
          d.title.toLowerCase().includes(searchString) ||
          (description === "true"
            ? d.description?.toLowerCase().includes(searchString)
            : "") ||
          d.searchKeyword.toLowerCase().includes(searchString) ||
          (tags === "true"
            ? d.tags?.toLowerCase().includes(searchString)
            : "") ||
          (categories === "true"
            ? d.categories?.toLowerCase().includes(searchString)
            : "") ||
          d.content.toLowerCase().includes(searchString)
      );

      // pull template from hugo templarte definition
      let templateDefinition =
        searchResultItemTemplate != null
          ? searchResultItemTemplate.innerHTML
          : `
          <div class="search-result-item">
          <div class="search-image">#{image}</div>
          <div class="search-content-block">
            <a href="#{slug}" class="search-title">#{title}</a>
            <p class="search-description">#{description}</p>
            <p class="search-content">#{content}</p>
            <div class="search-info">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="margin-top:-2px">
                  <path d="M11 0H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2 2 2 0 0 0-2-2zm2 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1V3zM2 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2z"/>
                </svg>
                #{categories}
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                </svg>
                #{tags}
              </div>
            </div>
          </div>
        </div>`;

      const renderedItems = filteredItems
        .map((innerItem) => {
          let output = renderResult(templateDefinition, {
            slug: innerItem.slug,
            date: innerItem.date,
            description:
              description == "true"
                ? highlightResult(innerItem.description)
                : "",
            title: highlightResult(innerItem.title),
            image: image == "true" ? innerItem.image : "",
            tags: tags == "true" ? highlightResult(innerItem.tags) : "nomatch",
            categories:
              categories == "true"
                ? highlightResult(innerItem.categories)
                : "nomatch",
            content: highlightResultContent(innerItem.content),
          });

          return output;
        })
        .join("");

      return `
				<div class="search-result-group">
					<p class="search-result-group-title">${item.section}</p>
					${renderedItems}
				</div>`;
    };

    const filteredItemsLength = searchItems.reduce((totalLength, item) => {
      const filteredItems = item.data.filter(
        (d) =>
          d.title.toLowerCase().includes(searchString) ||
          (description === "true"
            ? d.description?.toLowerCase().includes(searchString)
            : "") ||
          d.searchKeyword.toLowerCase().includes(searchString) ||
          (tags === "true"
            ? d.tags?.toLowerCase().includes(searchString)
            : "") ||
          (categories === "true"
            ? d.categories?.toLowerCase().includes(searchString)
            : "") ||
          d.content.toLowerCase().includes(searchString)
      );

      return totalLength + filteredItems.length;
    }, 0);

    // count time start
    const startTime = performance.now();

    // Render Result into HTML
    const htmlString = searchItems.map(generateSearchResultHTML).join("");
    searchResult.forEach((el) => {
      el.innerHTML = htmlString;
    });

    // count time end
    const endTime = performance.now();

    // count total-result and time
    let totalResults = `<em>${filteredItemsLength}</em> results`;
    let totalTime = ((endTime - startTime) / 1000).toFixed(3);
    totalTime = `- in <em>${totalTime}</em> seconds`;

    searchResultInfo &&
      (searchResultInfo.innerHTML =
        filteredItemsLength > 0 ? `${totalResults} ${totalTime}` : "");

    // hide search-result-group-title if un-available result
    const groupTitle = document.querySelectorAll(".search-result-group-title");
    groupTitle.forEach((el) => {
      // hide search-result-group-title if there is no result
      if (el.nextElementSibling === null) {
        el.style.display = "none";
      }
      // hide emptySearchResult if there is no result
      if (el.nextElementSibling != null) {
        emptySearchResult.forEach((el) => {
          el.style.display = "";
        });
      } else {
        emptySearchResult.forEach((el) => {
          el.style.display = "block";
        });
      }
    });

    // hide tag/category if un-available result
    const searchInfo = document.querySelectorAll(".search-info > div");
    if (searchInfo.length > 0) {
      // hide tag/category if there is no result
      searchInfo.forEach((el) => {
        if (el.innerText.includes("nomatch") || el.innerText == "") {
          el.classList.add("hidden");
        }
      });
    }
  };
  loadJsonData();
}

// Render Result Template
const renderResult = (templateString, data) => {
  var conditionalMatches, conditionalPattern, copy;
  conditionalPattern = /\#\{\s*isset ([a-zA-Z]*) \s*\}(.*)\#\{\s*end\s*}/g;
  // since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while (
    (conditionalMatches = conditionalPattern.exec(templateString)) !== null
  ) {
    if (data[conditionalMatches[1]]) {
      // if valid key, remove conditionals, leave contents.
      copy = copy.replace(conditionalMatches[0], conditionalMatches[2]);
    } else {
      // if not valid, remove entire section
      copy = copy.replace(conditionalMatches[0], "");
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = "\\#\\{\\s*" + key + "\\s*\\}";
    re = new RegExp(find, "g");
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
};

// ========================================================================================

// Reset Serach
const resetSearch = () => {
  searchIcon && (searchIcon.style.display = "initial");
  searchIconReset && (searchIconReset.style.display = "none");
  searchInput.forEach((el) => {
    el.value = "";
  });
  searchResult.forEach((el) => {
    el.innerHTML = "";
  });
  emptySearchResult.forEach((el) => {
    el.style.display = "";
    el.innerHTML = empty_search_results_placeholder;
  });
  searchResultInfo.innerHTML = "";

  // clear search query string from URL
  if (window.location.search.includes("?s=")) {
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.hash
    );
  }
};

// Body Scroll
const enableBodyScroll = () => {
  setTimeout(() => {
    body.style.overflowY = "";
    body.style.paddingRight = "";
  }, 200);
};
const disableBodyScroll = () => {
  const documentWidth = document.documentElement.clientWidth;
  const scrollbarWidth = Math.abs(window.innerWidth - documentWidth);
  body.style.overflowY = "hidden";
  body.style.paddingRight = scrollbarWidth + "px";
};

// Show/Hide Search Modal
const showModal = () => {
  searchWrapper.classList.add("show");
  window.setTimeout(
    () => document.querySelector("[data-search-input]").focus(),
    100
  );
  if (hasSearchModal) {
    disableBodyScroll();
    searchModalVisible = true;
  }
};
const closeModal = () => {
  searchWrapper.classList.remove("show");
  resetSearch();
  if (hasSearchModal) {
    enableBodyScroll();
    searchModalVisible = false;
  }
};

// Trigger Search Modal Show/Hide Events
if (hasSearchWrapper) {
  // Show Search Modal on page load
  if (searchModalVisible) {
    showModal();
  }

  // Trigger Reset Search
  searchIconReset &&
    searchIconReset.addEventListener("click", () => {
      resetSearch();
    });

  // Open Search Modal with click
  openSearchModal.forEach((el) => {
    el.addEventListener("click", function () {
      showModal();
    });
  });

  // Close Search Modal with click
  closeSearchModal.forEach((el) => {
    el.addEventListener("click", function () {
      closeModal();
    });
  });

  // Close modal on click outside modal-body
  searchWrapper.addEventListener("click", function (e) {
    if (e.target.classList.contains("search-wrapper")) {
      closeModal();
    }
  });

  // Close modal with ESC
  const closeSearchModalWithESC = (e) => {
    if (e.key === "Escape") {
      if (searchModalVisible) {
        e.preventDefault();
        closeModal();
      }
    }
  };

  // Toggle modal on Ctrl + K / Cmd + K
  const toggleSearchModalWithK = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      if (searchModalVisible) {
        e.preventDefault();
        closeModal();
      } else {
        e.preventDefault();
        showModal();
      }
    }
  };
  document.addEventListener("keydown", (e) => {
    toggleSearchModalWithK(e);
    closeSearchModalWithESC(e);
  });
}

;
/**
 * Swiper 8.0.7
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: March 4, 2022
 */

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      (global.Swiper = factory()));
})(this, function () {
  "use strict";

  /**
   * SSR Window 4.0.2
   * Better handling for window object in SSR environment
   * https://github.com/nolimits4web/ssr-window
   *
   * Copyright 2021, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: December 13, 2021
   */

  /* eslint-disable no-param-reassign */
  function isObject$1(obj) {
    return (
      obj !== null &&
      typeof obj === "object" &&
      "constructor" in obj &&
      obj.constructor === Object
    );
  }

  function extend$1(target, src) {
    if (target === void 0) {
      target = {};
    }

    if (src === void 0) {
      src = {};
    }

    Object.keys(src).forEach((key) => {
      if (typeof target[key] === "undefined") target[key] = src[key];
      else if (
        isObject$1(src[key]) &&
        isObject$1(target[key]) &&
        Object.keys(src[key]).length > 0
      ) {
        extend$1(target[key], src[key]);
      }
    });
  }

  const ssrDocument = {
    body: {},

    addEventListener() {},

    removeEventListener() {},

    activeElement: {
      blur() {},

      nodeName: "",
    },

    querySelector() {
      return null;
    },

    querySelectorAll() {
      return [];
    },

    getElementById() {
      return null;
    },

    createEvent() {
      return {
        initEvent() {},
      };
    },

    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},

        setAttribute() {},

        getElementsByTagName() {
          return [];
        },
      };
    },

    createElementNS() {
      return {};
    },

    importNode() {
      return null;
    },

    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
  };

  function getDocument() {
    const doc = typeof document !== "undefined" ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
  }

  const ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: "",
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
    history: {
      replaceState() {},

      pushState() {},

      go() {},

      back() {},
    },
    CustomEvent: function CustomEvent() {
      return this;
    },

    addEventListener() {},

    removeEventListener() {},

    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        },
      };
    },

    Image() {},

    Date() {},

    screen: {},

    setTimeout() {},

    clearTimeout() {},

    matchMedia() {
      return {};
    },

    requestAnimationFrame(callback) {
      if (typeof setTimeout === "undefined") {
        callback();
        return null;
      }

      return setTimeout(callback, 0);
    },

    cancelAnimationFrame(id) {
      if (typeof setTimeout === "undefined") {
        return;
      }

      clearTimeout(id);
    },
  };

  function getWindow() {
    const win = typeof window !== "undefined" ? window : {};
    extend$1(win, ssrWindow);
    return win;
  }

  /**
   * Dom7 4.0.4
   * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
   * https://framework7.io/docs/dom7.html
   *
   * Copyright 2022, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: January 11, 2022
   */
  /* eslint-disable no-proto */

  function makeReactive(obj) {
    const proto = obj.__proto__;
    Object.defineProperty(obj, "__proto__", {
      get() {
        return proto;
      },

      set(value) {
        proto.__proto__ = value;
      },
    });
  }

  class Dom7 extends Array {
    constructor(items) {
      if (typeof items === "number") {
        super(items);
      } else {
        super(...(items || []));
        makeReactive(this);
      }
    }
  }

  function arrayFlat(arr) {
    if (arr === void 0) {
      arr = [];
    }

    const res = [];
    arr.forEach((el) => {
      if (Array.isArray(el)) {
        res.push(...arrayFlat(el));
      } else {
        res.push(el);
      }
    });
    return res;
  }

  function arrayFilter(arr, callback) {
    return Array.prototype.filter.call(arr, callback);
  }

  function arrayUnique(arr) {
    const uniqueArray = [];

    for (let i = 0; i < arr.length; i += 1) {
      if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
    }

    return uniqueArray;
  }

  function qsa(selector, context) {
    if (typeof selector !== "string") {
      return [selector];
    }

    const a = [];
    const res = context.querySelectorAll(selector);

    for (let i = 0; i < res.length; i += 1) {
      a.push(res[i]);
    }

    return a;
  }

  function $(selector, context) {
    const window = getWindow();
    const document = getDocument();
    let arr = [];

    if (!context && selector instanceof Dom7) {
      return selector;
    }

    if (!selector) {
      return new Dom7(arr);
    }

    if (typeof selector === "string") {
      const html = selector.trim();

      if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
        let toCreate = "div";
        if (html.indexOf("<li") === 0) toCreate = "ul";
        if (html.indexOf("<tr") === 0) toCreate = "tbody";
        if (html.indexOf("<td") === 0 || html.indexOf("<th") === 0)
          toCreate = "tr";
        if (html.indexOf("<tbody") === 0) toCreate = "table";
        if (html.indexOf("<option") === 0) toCreate = "select";
        const tempParent = document.createElement(toCreate);
        tempParent.innerHTML = html;

        for (let i = 0; i < tempParent.childNodes.length; i += 1) {
          arr.push(tempParent.childNodes[i]);
        }
      } else {
        arr = qsa(selector.trim(), context || document);
      } // arr = qsa(selector, document);
    } else if (
      selector.nodeType ||
      selector === window ||
      selector === document
    ) {
      arr.push(selector);
    } else if (Array.isArray(selector)) {
      if (selector instanceof Dom7) return selector;
      arr = selector;
    }

    return new Dom7(arrayUnique(arr));
  }

  $.fn = Dom7.prototype; // eslint-disable-next-line

  function addClass() {
    for (
      var _len = arguments.length, classes = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      classes[_key] = arguments[_key];
    }

    const classNames = arrayFlat(classes.map((c) => c.split(" ")));
    this.forEach((el) => {
      el.classList.add(...classNames);
    });
    return this;
  }

  function removeClass() {
    for (
      var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      classes[_key2] = arguments[_key2];
    }

    const classNames = arrayFlat(classes.map((c) => c.split(" ")));
    this.forEach((el) => {
      el.classList.remove(...classNames);
    });
    return this;
  }

  function toggleClass() {
    for (
      var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      classes[_key3] = arguments[_key3];
    }

    const classNames = arrayFlat(classes.map((c) => c.split(" ")));
    this.forEach((el) => {
      classNames.forEach((className) => {
        el.classList.toggle(className);
      });
    });
  }

  function hasClass() {
    for (
      var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0;
      _key4 < _len4;
      _key4++
    ) {
      classes[_key4] = arguments[_key4];
    }

    const classNames = arrayFlat(classes.map((c) => c.split(" ")));
    return (
      arrayFilter(this, (el) => {
        return (
          classNames.filter((className) => el.classList.contains(className))
            .length > 0
        );
      }).length > 0
    );
  }

  function attr(attrs, value) {
    if (arguments.length === 1 && typeof attrs === "string") {
      // Get attr
      if (this[0]) return this[0].getAttribute(attrs);
      return undefined;
    } // Set attrs

    for (let i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i].setAttribute(attrs, value);
      } else {
        // Object
        for (const attrName in attrs) {
          this[i][attrName] = attrs[attrName];
          this[i].setAttribute(attrName, attrs[attrName]);
        }
      }
    }

    return this;
  }

  function removeAttr(attr) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].removeAttribute(attr);
    }

    return this;
  }

  function transform(transform) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].style.transform = transform;
    }

    return this;
  }

  function transition$1(duration) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].style.transitionDuration =
        typeof duration !== "string" ? `${duration}ms` : duration;
    }

    return this;
  }

  function on() {
    for (
      var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
      _key5 < _len5;
      _key5++
    ) {
      args[_key5] = arguments[_key5];
    }

    let [eventType, targetSelector, listener, capture] = args;

    if (typeof args[1] === "function") {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }

    if (!capture) capture = false;

    function handleLiveEvent(e) {
      const target = e.target;
      if (!target) return;
      const eventData = e.target.dom7EventData || [];

      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }

      if ($(target).is(targetSelector)) listener.apply(target, eventData);
      else {
        const parents = $(target).parents(); // eslint-disable-line

        for (let k = 0; k < parents.length; k += 1) {
          if ($(parents[k]).is(targetSelector))
            listener.apply(parents[k], eventData);
        }
      }
    }

    function handleEvent(e) {
      const eventData = e && e.target ? e.target.dom7EventData || [] : [];

      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }

      listener.apply(this, eventData);
    }

    const events = eventType.split(" ");
    let j;

    for (let i = 0; i < this.length; i += 1) {
      const el = this[i];

      if (!targetSelector) {
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7Listeners) el.dom7Listeners = {};
          if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
          el.dom7Listeners[event].push({
            listener,
            proxyListener: handleEvent,
          });
          el.addEventListener(event, handleEvent, capture);
        }
      } else {
        // Live events
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
          if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
          el.dom7LiveListeners[event].push({
            listener,
            proxyListener: handleLiveEvent,
          });
          el.addEventListener(event, handleLiveEvent, capture);
        }
      }
    }

    return this;
  }

  function off() {
    for (
      var _len6 = arguments.length, args = new Array(_len6), _key6 = 0;
      _key6 < _len6;
      _key6++
    ) {
      args[_key6] = arguments[_key6];
    }

    let [eventType, targetSelector, listener, capture] = args;

    if (typeof args[1] === "function") {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }

    if (!capture) capture = false;
    const events = eventType.split(" ");

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];

      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let handlers;

        if (!targetSelector && el.dom7Listeners) {
          handlers = el.dom7Listeners[event];
        } else if (targetSelector && el.dom7LiveListeners) {
          handlers = el.dom7LiveListeners[event];
        }

        if (handlers && handlers.length) {
          for (let k = handlers.length - 1; k >= 0; k -= 1) {
            const handler = handlers[k];

            if (listener && handler.listener === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (
              listener &&
              handler.listener &&
              handler.listener.dom7proxy &&
              handler.listener.dom7proxy === listener
            ) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (!listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            }
          }
        }
      }
    }

    return this;
  }

  function trigger() {
    const window = getWindow();

    for (
      var _len9 = arguments.length, args = new Array(_len9), _key9 = 0;
      _key9 < _len9;
      _key9++
    ) {
      args[_key9] = arguments[_key9];
    }

    const events = args[0].split(" ");
    const eventData = args[1];

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];

      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];

        if (window.CustomEvent) {
          const evt = new window.CustomEvent(event, {
            detail: eventData,
            bubbles: true,
            cancelable: true,
          });
          el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
          el.dispatchEvent(evt);
          el.dom7EventData = [];
          delete el.dom7EventData;
        }
      }
    }

    return this;
  }

  function transitionEnd$1(callback) {
    const dom = this;

    function fireCallBack(e) {
      if (e.target !== this) return;
      callback.call(this, e);
      dom.off("transitionend", fireCallBack);
    }

    if (callback) {
      dom.on("transitionend", fireCallBack);
    }

    return this;
  }

  function outerWidth(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        const styles = this.styles();
        return (
          this[0].offsetWidth +
          parseFloat(styles.getPropertyValue("margin-right")) +
          parseFloat(styles.getPropertyValue("margin-left"))
        );
      }

      return this[0].offsetWidth;
    }

    return null;
  }

  function outerHeight(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        const styles = this.styles();
        return (
          this[0].offsetHeight +
          parseFloat(styles.getPropertyValue("margin-top")) +
          parseFloat(styles.getPropertyValue("margin-bottom"))
        );
      }

      return this[0].offsetHeight;
    }

    return null;
  }

  function offset() {
    if (this.length > 0) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      const box = el.getBoundingClientRect();
      const body = document.body;
      const clientTop = el.clientTop || body.clientTop || 0;
      const clientLeft = el.clientLeft || body.clientLeft || 0;
      const scrollTop = el === window ? window.scrollY : el.scrollTop;
      const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
      return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft,
      };
    }

    return null;
  }

  function styles() {
    const window = getWindow();
    if (this[0]) return window.getComputedStyle(this[0], null);
    return {};
  }

  function css(props, value) {
    const window = getWindow();
    let i;

    if (arguments.length === 1) {
      if (typeof props === "string") {
        // .css('width')
        if (this[0])
          return window.getComputedStyle(this[0], null).getPropertyValue(props);
      } else {
        // .css({ width: '100px' })
        for (i = 0; i < this.length; i += 1) {
          for (const prop in props) {
            this[i].style[prop] = props[prop];
          }
        }

        return this;
      }
    }

    if (arguments.length === 2 && typeof props === "string") {
      // .css('width', '100px')
      for (i = 0; i < this.length; i += 1) {
        this[i].style[props] = value;
      }

      return this;
    }

    return this;
  }

  function each(callback) {
    if (!callback) return this;
    this.forEach((el, index) => {
      callback.apply(el, [el, index]);
    });
    return this;
  }

  function filter(callback) {
    const result = arrayFilter(this, callback);
    return $(result);
  }

  function html(html) {
    if (typeof html === "undefined") {
      return this[0] ? this[0].innerHTML : null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].innerHTML = html;
    }

    return this;
  }

  function text(text) {
    if (typeof text === "undefined") {
      return this[0] ? this[0].textContent.trim() : null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].textContent = text;
    }

    return this;
  }

  function is(selector) {
    const window = getWindow();
    const document = getDocument();
    const el = this[0];
    let compareWith;
    let i;
    if (!el || typeof selector === "undefined") return false;

    if (typeof selector === "string") {
      if (el.matches) return el.matches(selector);
      if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
      if (el.msMatchesSelector) return el.msMatchesSelector(selector);
      compareWith = $(selector);

      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }

      return false;
    }

    if (selector === document) {
      return el === document;
    }

    if (selector === window) {
      return el === window;
    }

    if (selector.nodeType || selector instanceof Dom7) {
      compareWith = selector.nodeType ? [selector] : selector;

      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }

      return false;
    }

    return false;
  }

  function index() {
    let child = this[0];
    let i;

    if (child) {
      i = 0; // eslint-disable-next-line

      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }

      return i;
    }

    return undefined;
  }

  function eq(index) {
    if (typeof index === "undefined") return this;
    const length = this.length;

    if (index > length - 1) {
      return $([]);
    }

    if (index < 0) {
      const returnIndex = length + index;
      if (returnIndex < 0) return $([]);
      return $([this[returnIndex]]);
    }

    return $([this[index]]);
  }

  function append() {
    let newChild;
    const document = getDocument();

    for (let k = 0; k < arguments.length; k += 1) {
      newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

      for (let i = 0; i < this.length; i += 1) {
        if (typeof newChild === "string") {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = newChild;

          while (tempDiv.firstChild) {
            this[i].appendChild(tempDiv.firstChild);
          }
        } else if (newChild instanceof Dom7) {
          for (let j = 0; j < newChild.length; j += 1) {
            this[i].appendChild(newChild[j]);
          }
        } else {
          this[i].appendChild(newChild);
        }
      }
    }

    return this;
  }

  function prepend(newChild) {
    const document = getDocument();
    let i;
    let j;

    for (i = 0; i < this.length; i += 1) {
      if (typeof newChild === "string") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = newChild;

        for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
          this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        }
      } else if (newChild instanceof Dom7) {
        for (j = 0; j < newChild.length; j += 1) {
          this[i].insertBefore(newChild[j], this[i].childNodes[0]);
        }
      } else {
        this[i].insertBefore(newChild, this[i].childNodes[0]);
      }
    }

    return this;
  }

  function next(selector) {
    if (this.length > 0) {
      if (selector) {
        if (
          this[0].nextElementSibling &&
          $(this[0].nextElementSibling).is(selector)
        ) {
          return $([this[0].nextElementSibling]);
        }

        return $([]);
      }

      if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
      return $([]);
    }

    return $([]);
  }

  function nextAll(selector) {
    const nextEls = [];
    let el = this[0];
    if (!el) return $([]);

    while (el.nextElementSibling) {
      const next = el.nextElementSibling; // eslint-disable-line

      if (selector) {
        if ($(next).is(selector)) nextEls.push(next);
      } else nextEls.push(next);

      el = next;
    }

    return $(nextEls);
  }

  function prev(selector) {
    if (this.length > 0) {
      const el = this[0];

      if (selector) {
        if (
          el.previousElementSibling &&
          $(el.previousElementSibling).is(selector)
        ) {
          return $([el.previousElementSibling]);
        }

        return $([]);
      }

      if (el.previousElementSibling) return $([el.previousElementSibling]);
      return $([]);
    }

    return $([]);
  }

  function prevAll(selector) {
    const prevEls = [];
    let el = this[0];
    if (!el) return $([]);

    while (el.previousElementSibling) {
      const prev = el.previousElementSibling; // eslint-disable-line

      if (selector) {
        if ($(prev).is(selector)) prevEls.push(prev);
      } else prevEls.push(prev);

      el = prev;
    }

    return $(prevEls);
  }

  function parent(selector) {
    const parents = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode !== null) {
        if (selector) {
          if ($(this[i].parentNode).is(selector))
            parents.push(this[i].parentNode);
        } else {
          parents.push(this[i].parentNode);
        }
      }
    }

    return $(parents);
  }

  function parents(selector) {
    const parents = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      let parent = this[i].parentNode; // eslint-disable-line

      while (parent) {
        if (selector) {
          if ($(parent).is(selector)) parents.push(parent);
        } else {
          parents.push(parent);
        }

        parent = parent.parentNode;
      }
    }

    return $(parents);
  }

  function closest(selector) {
    let closest = this; // eslint-disable-line

    if (typeof selector === "undefined") {
      return $([]);
    }

    if (!closest.is(selector)) {
      closest = closest.parents(selector).eq(0);
    }

    return closest;
  }

  function find(selector) {
    const foundElements = [];

    for (let i = 0; i < this.length; i += 1) {
      const found = this[i].querySelectorAll(selector);

      for (let j = 0; j < found.length; j += 1) {
        foundElements.push(found[j]);
      }
    }

    return $(foundElements);
  }

  function children(selector) {
    const children = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      const childNodes = this[i].children;

      for (let j = 0; j < childNodes.length; j += 1) {
        if (!selector || $(childNodes[j]).is(selector)) {
          children.push(childNodes[j]);
        }
      }
    }

    return $(children);
  }

  function remove() {
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
    }

    return this;
  }

  const Methods = {
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    attr,
    removeAttr,
    transform,
    transition: transition$1,
    on,
    off,
    trigger,
    transitionEnd: transitionEnd$1,
    outerWidth,
    outerHeight,
    styles,
    offset,
    css,
    each,
    html,
    text,
    is,
    index,
    eq,
    append,
    prepend,
    next,
    nextAll,
    prev,
    prevAll,
    parent,
    parents,
    closest,
    find,
    children,
    filter,
    remove,
  };
  Object.keys(Methods).forEach((methodName) => {
    Object.defineProperty($.fn, methodName, {
      value: Methods[methodName],
      writable: true,
    });
  });

  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e) {
        // no getter for object
      }

      try {
        delete object[key];
      } catch (e) {
        // something got wrong
      }
    });
  }

  function nextTick(callback, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    return setTimeout(callback, delay);
  }

  function now() {
    return Date.now();
  }

  function getComputedStyle$1(el) {
    const window = getWindow();
    let style;

    if (window.getComputedStyle) {
      style = window.getComputedStyle(el, null);
    }

    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }

    if (!style) {
      style = el.style;
    }

    return style;
  }

  function getTranslate(el, axis) {
    if (axis === void 0) {
      axis = "x";
    }

    const window = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle$1(el);

    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;

      if (curTransform.split(",").length > 6) {
        curTransform = curTransform
          .split(", ")
          .map((a) => a.replace(",", "."))
          .join(", ");
      } // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case

      transformMatrix = new window.WebKitCSSMatrix(
        curTransform === "none" ? "" : curTransform
      );
    } else {
      transformMatrix =
        curStyle.MozTransform ||
        curStyle.OTransform ||
        curStyle.MsTransform ||
        curStyle.msTransform ||
        curStyle.transform ||
        curStyle
          .getPropertyValue("transform")
          .replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }

    if (axis === "x") {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix)
        curTransform = transformMatrix.m41; // Crazy IE10 Matrix
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[12]); // Normal Browsers
      else curTransform = parseFloat(matrix[4]);
    }

    if (axis === "y") {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix)
        curTransform = transformMatrix.m42; // Crazy IE10 Matrix
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[13]); // Normal Browsers
      else curTransform = parseFloat(matrix[5]);
    }

    return curTransform || 0;
  }

  function isObject(o) {
    return (
      typeof o === "object" &&
      o !== null &&
      o.constructor &&
      Object.prototype.toString.call(o).slice(8, -1) === "Object"
    );
  }

  function isNode(node) {
    // eslint-disable-next-line
    if (
      typeof window !== "undefined" &&
      typeof window.HTMLElement !== "undefined"
    ) {
      return node instanceof HTMLElement;
    }

    return node && (node.nodeType === 1 || node.nodeType === 11);
  }

  function extend() {
    const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
    const noExtend = ["__proto__", "constructor", "prototype"];

    for (let i = 1; i < arguments.length; i += 1) {
      const nextSource =
        i < 0 || arguments.length <= i ? undefined : arguments[i];

      if (
        nextSource !== undefined &&
        nextSource !== null &&
        !isNode(nextSource)
      ) {
        const keysArray = Object.keys(Object(nextSource)).filter(
          (key) => noExtend.indexOf(key) < 0
        );

        for (
          let nextIndex = 0, len = keysArray.length;
          nextIndex < len;
          nextIndex += 1
        ) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

          if (desc !== undefined && desc.enumerable) {
            if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else if (
              !isObject(to[nextKey]) &&
              isObject(nextSource[nextKey])
            ) {
              to[nextKey] = {};

              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }

    return to;
  }

  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }

  function animateCSSModeScroll(_ref) {
    let { swiper, targetPosition, side } = _ref;
    const window = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";

    const isOutOfBound = (current, target) => {
      return (
        (dir === "next" && current >= target) ||
        (dir === "prev" && current <= target)
      );
    };

    const animate = () => {
      time = new Date().getTime();

      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition =
        startPosition + easeProgress * (targetPosition - startPosition);

      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }

      swiper.wrapperEl.scrollTo({
        [side]: currentPosition,
      });

      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition,
          });
        });
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }

      swiper.cssModeFrameID = window.requestAnimationFrame(animate);
    };

    animate();
  }

  let support;

  function calcSupport() {
    const window = getWindow();
    const document = getDocument();
    return {
      smoothScroll:
        document.documentElement &&
        "scrollBehavior" in document.documentElement.style,
      touch: !!(
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
      ),
      passiveListener: (function checkPassiveListener() {
        let supportsPassive = false;

        try {
          const opts = Object.defineProperty({}, "passive", {
            // eslint-disable-next-line
            get() {
              supportsPassive = true;
            },
          });
          window.addEventListener("testPassiveListener", null, opts);
        } catch (e) {
          // No support
        }

        return supportsPassive;
      })(),
      gestures: (function checkGestures() {
        return "ongesturestart" in window;
      })(),
    };
  }

  function getSupport() {
    if (!support) {
      support = calcSupport();
    }

    return support;
  }

  let deviceCached;

  function calcDevice(_temp) {
    let { userAgent } = _temp === void 0 ? {} : _temp;
    const support = getSupport();
    const window = getWindow();
    const platform = window.navigator.platform;
    const ua = userAgent || window.navigator.userAgent;
    const device = {
      ios: false,
      android: false,
    };
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel"; // iPadOs 13 fix

    const iPadScreens = [
      "1024x1366",
      "1366x1024",
      "834x1194",
      "1194x834",
      "834x1112",
      "1112x834",
      "768x1024",
      "1024x768",
      "820x1180",
      "1180x820",
      "810x1080",
      "1080x810",
    ];

    if (
      !ipad &&
      macos &&
      support.touch &&
      iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0
    ) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, "13_0_0"];
      macos = false;
    } // Android

    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }

    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    } // Export object

    return device;
  }

  function getDevice(overrides) {
    if (overrides === void 0) {
      overrides = {};
    }

    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }

    return deviceCached;
  }

  let browser;

  function calcBrowser() {
    const window = getWindow();

    function isSafari() {
      const ua = window.navigator.userAgent.toLowerCase();
      return (
        ua.indexOf("safari") >= 0 &&
        ua.indexOf("chrome") < 0 &&
        ua.indexOf("android") < 0
      );
    }

    return {
      isSafari: isSafari(),
      isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
        window.navigator.userAgent
      ),
    };
  }

  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }

    return browser;
  }

  function Resize(_ref) {
    let { swiper, on, emit } = _ref;
    const window = getWindow();
    let observer = null;
    let animationFrame = null;

    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("beforeResize");
      emit("resize");
    };

    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window.requestAnimationFrame(() => {
          const { width, height } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach((_ref2) => {
            let { contentBoxSize, contentRect, target } = _ref2;
            if (target && target !== swiper.el) return;
            newWidth = contentRect
              ? contentRect.width
              : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect
              ? contentRect.height
              : (contentBoxSize[0] || contentBoxSize).blockSize;
          });

          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };

    const removeObserver = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };

    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("orientationchange");
    };

    on("init", () => {
      if (
        swiper.params.resizeObserver &&
        typeof window.ResizeObserver !== "undefined"
      ) {
        createObserver();
        return;
      }

      window.addEventListener("resize", resizeHandler);
      window.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }

  function Observer(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const observers = [];
    const window = getWindow();

    const attach = function (target, options) {
      if (options === void 0) {
        options = {};
      }

      const ObserverFunc =
        window.MutationObserver || window.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        // The observerUpdate event should only be triggered
        // once despite the number of mutations.  Additional
        // triggers are redundant and are very costly
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }

        const observerUpdate = function observerUpdate() {
          emit("observerUpdate", mutations[0]);
        };

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(observerUpdate);
        } else {
          window.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes:
          typeof options.attributes === "undefined" ? true : options.attributes,
        childList:
          typeof options.childList === "undefined" ? true : options.childList,
        characterData:
          typeof options.characterData === "undefined"
            ? true
            : options.characterData,
      });
      observers.push(observer);
    };

    const init = () => {
      if (!swiper.params.observer) return;

      if (swiper.params.observeParents) {
        const containerParents = swiper.$el.parents();

        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      } // Observe container

      attach(swiper.$el[0], {
        childList: swiper.params.observeSlideChildren,
      }); // Observe wrapper

      attach(swiper.$wrapperEl[0], {
        attributes: false,
      });
    };

    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };

    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false,
    });
    on("init", init);
    on("destroy", destroy);
  }

  /* eslint-disable no-underscore-dangle */
  var eventsEmitter = {
    on(events, handler, priority) {
      const self = this;
      if (typeof handler !== "function") return self;
      const method = priority ? "unshift" : "push";
      events.split(" ").forEach((event) => {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    },

    once(events, handler, priority) {
      const self = this;
      if (typeof handler !== "function") return self;

      function onceHandler() {
        self.off(events, onceHandler);

        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }

        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key];
        }

        handler.apply(self, args);
      }

      onceHandler.__emitterProxy = handler;
      return self.on(events, onceHandler, priority);
    },

    onAny(handler, priority) {
      const self = this;
      if (typeof handler !== "function") return self;
      const method = priority ? "unshift" : "push";

      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }

      return self;
    },

    offAny(handler) {
      const self = this;
      if (!self.eventsAnyListeners) return self;
      const index = self.eventsAnyListeners.indexOf(handler);

      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }

      return self;
    },

    off(events, handler) {
      const self = this;
      if (!self.eventsListeners) return self;
      events.split(" ").forEach((event) => {
        if (typeof handler === "undefined") {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event]) {
          self.eventsListeners[event].forEach((eventHandler, index) => {
            if (
              eventHandler === handler ||
              (eventHandler.__emitterProxy &&
                eventHandler.__emitterProxy === handler)
            ) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
      return self;
    },

    emit() {
      const self = this;
      if (!self.eventsListeners) return self;
      let events;
      let data;
      let context;

      for (
        var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }

      if (typeof args[0] === "string" || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }

      data.unshift(context);
      const eventsArray = Array.isArray(events) ? events : events.split(" ");
      eventsArray.forEach((event) => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach((eventHandler) => {
            eventHandler.apply(context, [event, ...data]);
          });
        }

        if (self.eventsListeners && self.eventsListeners[event]) {
          self.eventsListeners[event].forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    },
  };

  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const $el = swiper.$el;

    if (
      typeof swiper.params.width !== "undefined" &&
      swiper.params.width !== null
    ) {
      width = swiper.params.width;
    } else {
      width = $el[0].clientWidth;
    }

    if (
      typeof swiper.params.height !== "undefined" &&
      swiper.params.height !== null
    ) {
      height = swiper.params.height;
    } else {
      height = $el[0].clientHeight;
    }

    if (
      (width === 0 && swiper.isHorizontal()) ||
      (height === 0 && swiper.isVertical())
    ) {
      return;
    } // Subtract paddings

    width =
      width -
      parseInt($el.css("padding-left") || 0, 10) -
      parseInt($el.css("padding-right") || 0, 10);
    height =
      height -
      parseInt($el.css("padding-top") || 0, 10) -
      parseInt($el.css("padding-bottom") || 0, 10);
    if (Number.isNaN(width)) width = 0;
    if (Number.isNaN(height)) height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height,
    });
  }

  function updateSlides() {
    const swiper = this;

    function getDirectionLabel(property) {
      if (swiper.isHorizontal()) {
        return property;
      } // prettier-ignore

      return {
        width: "height",
        "margin-top": "margin-left",
        "margin-bottom ": "margin-right",
        "margin-left": "margin-top",
        "margin-right": "margin-bottom",
        "padding-left": "padding-top",
        "padding-right": "padding-bottom",
        marginRight: "marginBottom",
      }[property];
    }

    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
    }

    const params = swiper.params;
    const {
      $wrapperEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL,
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual
      ? swiper.virtual.slides.length
      : swiper.slides.length;
    const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
    const slidesLength = isVirtual
      ? swiper.virtual.slides.length
      : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;

    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }

    let offsetAfter = params.slidesOffsetAfter;

    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }

    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;

    if (typeof swiperSize === "undefined") {
      return;
    }

    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween =
        (parseFloat(spaceBetween.replace("%", "")) / 100) * swiperSize;
    }

    swiper.virtualSize = -spaceBetween; // reset margins

    if (rtl)
      slides.css({
        marginLeft: "",
        marginBottom: "",
        marginTop: "",
      });
    else
      slides.css({
        marginRight: "",
        marginBottom: "",
        marginTop: "",
      }); // reset cssMode offsets

    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
    }

    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

    if (gridEnabled) {
      swiper.grid.initSlides(slidesLength);
    } // Calc slides

    let slideSize;
    const shouldResetSlideSize =
      params.slidesPerView === "auto" &&
      params.breakpoints &&
      Object.keys(params.breakpoints).filter((key) => {
        return typeof params.breakpoints[key].slidesPerView !== "undefined";
      }).length > 0;

    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      const slide = slides.eq(i);

      if (gridEnabled) {
        swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
      }

      if (slide.css("display") === "none") continue; // eslint-disable-line

      if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slides[i].style[getDirectionLabel("width")] = ``;
        }

        const slideStyles = getComputedStyle(slide[0]);
        const currentTransform = slide[0].style.transform;
        const currentWebKitTransform = slide[0].style.webkitTransform;

        if (currentTransform) {
          slide[0].style.transform = "none";
        }

        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = "none";
        }

        if (params.roundLengths) {
          slideSize = swiper.isHorizontal()
            ? slide.outerWidth(true)
            : slide.outerHeight(true);
        } else {
          // eslint-disable-next-line
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(
            slideStyles,
            "padding-left"
          );
          const paddingRight = getDirectionPropertyValue(
            slideStyles,
            "padding-right"
          );
          const marginLeft = getDirectionPropertyValue(
            slideStyles,
            "margin-left"
          );
          const marginRight = getDirectionPropertyValue(
            slideStyles,
            "margin-right"
          );
          const boxSizing = slideStyles.getPropertyValue("box-sizing");

          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const { clientWidth, offsetWidth } = slide[0];
            slideSize =
              width +
              paddingLeft +
              paddingRight +
              marginLeft +
              marginRight +
              (offsetWidth - clientWidth);
          }
        }

        if (currentTransform) {
          slide[0].style.transform = currentTransform;
        }

        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = currentWebKitTransform;
        }

        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize =
          (swiperSize - (params.slidesPerView - 1) * spaceBetween) /
          params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);

        if (slides[i]) {
          slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
        }
      }

      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }

      slidesSizesGrid.push(slideSize);

      if (params.centeredSlides) {
        slidePosition =
          slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if (
          (index - Math.min(swiper.params.slidesPerGroupSkip, index)) %
            swiper.params.slidesPerGroup ===
          0
        )
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }

      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }

    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

    if (
      rtl &&
      wrongRTL &&
      (params.effect === "slide" || params.effect === "coverflow")
    ) {
      $wrapperEl.css({
        width: `${swiper.virtualSize + params.spaceBetween}px`,
      });
    }

    if (params.setWrapperSize) {
      $wrapperEl.css({
        [getDirectionLabel("width")]: `${
          swiper.virtualSize + params.spaceBetween
        }px`,
      });
    }

    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
    } // Remove last grid elements depending on width

    if (!params.centeredSlides) {
      const newSlidesGrid = [];

      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }

      snapGrid = newSlidesGrid;

      if (
        Math.floor(swiper.virtualSize - swiperSize) -
          Math.floor(snapGrid[snapGrid.length - 1]) >
        1
      ) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }

    if (snapGrid.length === 0) snapGrid = [0];

    if (params.spaceBetween !== 0) {
      const key =
        swiper.isHorizontal() && rtl
          ? "marginLeft"
          : getDirectionLabel("marginRight");
      slides
        .filter((_, slideIndex) => {
          if (!params.cssMode) return true;

          if (slideIndex === slides.length - 1) {
            return false;
          }

          return true;
        })
        .css({
          [key]: `${spaceBetween}px`,
        });
    }

    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize +=
          slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      const maxSnap = allSlidesSize - swiperSize;
      snapGrid = snapGrid.map((snap) => {
        if (snap < 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }

    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize +=
          slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;

      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }

    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid,
    });

    if (
      params.centeredSlides &&
      params.cssMode &&
      !params.centeredSlidesBounds
    ) {
      setCSSProperty(
        swiper.wrapperEl,
        "--swiper-centered-offset-before",
        `${-snapGrid[0]}px`
      );
      setCSSProperty(
        swiper.wrapperEl,
        "--swiper-centered-offset-after",
        `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`
      );
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }

    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }

    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }

    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }

    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }

    if (
      !isVirtual &&
      !params.cssMode &&
      (params.effect === "slide" || params.effect === "fade")
    ) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded =
        swiper.$el.hasClass(backFaceHiddenClass);

      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded)
          swiper.$el.addClass(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.$el.removeClass(backFaceHiddenClass);
      }
    }
  }

  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;

    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }

    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.slides.filter(
          (el) =>
            parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index
        )[0];
      }

      return swiper.slides.eq(index)[0];
    }; // Find slides currently in view

    if (
      swiper.params.slidesPerView !== "auto" &&
      swiper.params.slidesPerView > 1
    ) {
      if (swiper.params.centeredSlides) {
        swiper.visibleSlides.each((slide) => {
          activeSlides.push(slide);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual) break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    } // Find new height from highest slide in view

    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== "undefined") {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    } // Update Height

    if (newHeight || newHeight === 0)
      swiper.$wrapperEl.css("height", `${newHeight}px`);
  }

  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;

    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = swiper.isHorizontal()
        ? slides[i].offsetLeft
        : slides[i].offsetTop;
    }
  }

  function updateSlidesProgress(translate) {
    if (translate === void 0) {
      translate = (this && this.translate) || 0;
    }

    const swiper = this;
    const params = swiper.params;
    const { slides, rtlTranslate: rtl, snapGrid } = swiper;
    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === "undefined")
      swiper.updateSlidesOffset();
    let offsetCenter = -translate;
    if (rtl) offsetCenter = translate; // Visible Slides

    slides.removeClass(params.slideVisibleClass);
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];

    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      let slideOffset = slide.swiperSlideOffset;

      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }

      const slideProgress =
        (offsetCenter +
          (params.centeredSlides ? swiper.minTranslate() : 0) -
          slideOffset) /
        (slide.swiperSlideSize + params.spaceBetween);
      const originalSlideProgress =
        (offsetCenter -
          snapGrid[0] +
          (params.centeredSlides ? swiper.minTranslate() : 0) -
          slideOffset) /
        (slide.swiperSlideSize + params.spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isVisible =
        (slideBefore >= 0 && slideBefore < swiper.size - 1) ||
        (slideAfter > 1 && slideAfter <= swiper.size) ||
        (slideBefore <= 0 && slideAfter >= swiper.size);

      if (isVisible) {
        swiper.visibleSlides.push(slide);
        swiper.visibleSlidesIndexes.push(i);
        slides.eq(i).addClass(params.slideVisibleClass);
      }

      slide.progress = rtl ? -slideProgress : slideProgress;
      slide.originalProgress = rtl
        ? -originalSlideProgress
        : originalSlideProgress;
    }

    swiper.visibleSlides = $(swiper.visibleSlides);
  }

  function updateProgress(translate) {
    const swiper = this;

    if (typeof translate === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

      translate =
        (swiper && swiper.translate && swiper.translate * multiplier) || 0;
    }

    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let { progress, isBeginning, isEnd } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;

    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / translatesDiff;
      isBeginning = progress <= 0;
      isEnd = progress >= 1;
    }

    Object.assign(swiper, {
      progress,
      isBeginning,
      isEnd,
    });
    if (
      params.watchSlidesProgress ||
      (params.centeredSlides && params.autoHeight)
    )
      swiper.updateSlidesProgress(translate);

    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }

    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }

    if ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) {
      swiper.emit("fromEdge");
    }

    swiper.emit("progress", progress);
  }

  function updateSlidesClasses() {
    const swiper = this;
    const { slides, params, $wrapperEl, activeIndex, realIndex } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    slides.removeClass(
      `${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`
    );
    let activeSlide;

    if (isVirtual) {
      activeSlide = swiper.$wrapperEl.find(
        `.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`
      );
    } else {
      activeSlide = slides.eq(activeIndex);
    } // Active classes

    activeSlide.addClass(params.slideActiveClass);

    if (params.loop) {
      // Duplicate to all looped slides
      if (activeSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(
            `.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`
          )
          .addClass(params.slideDuplicateActiveClass);
      } else {
        $wrapperEl
          .children(
            `.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`
          )
          .addClass(params.slideDuplicateActiveClass);
      }
    } // Next Slide

    let nextSlide = activeSlide
      .nextAll(`.${params.slideClass}`)
      .eq(0)
      .addClass(params.slideNextClass);

    if (params.loop && nextSlide.length === 0) {
      nextSlide = slides.eq(0);
      nextSlide.addClass(params.slideNextClass);
    } // Prev Slide

    let prevSlide = activeSlide
      .prevAll(`.${params.slideClass}`)
      .eq(0)
      .addClass(params.slidePrevClass);

    if (params.loop && prevSlide.length === 0) {
      prevSlide = slides.eq(-1);
      prevSlide.addClass(params.slidePrevClass);
    }

    if (params.loop) {
      // Duplicate to all looped slides
      if (nextSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(
            `.${params.slideClass}:not(.${
              params.slideDuplicateClass
            })[data-swiper-slide-index="${nextSlide.attr(
              "data-swiper-slide-index"
            )}"]`
          )
          .addClass(params.slideDuplicateNextClass);
      } else {
        $wrapperEl
          .children(
            `.${params.slideClass}.${
              params.slideDuplicateClass
            }[data-swiper-slide-index="${nextSlide.attr(
              "data-swiper-slide-index"
            )}"]`
          )
          .addClass(params.slideDuplicateNextClass);
      }

      if (prevSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(
            `.${params.slideClass}:not(.${
              params.slideDuplicateClass
            })[data-swiper-slide-index="${prevSlide.attr(
              "data-swiper-slide-index"
            )}"]`
          )
          .addClass(params.slideDuplicatePrevClass);
      } else {
        $wrapperEl
          .children(
            `.${params.slideClass}.${
              params.slideDuplicateClass
            }[data-swiper-slide-index="${prevSlide.attr(
              "data-swiper-slide-index"
            )}"]`
          )
          .addClass(params.slideDuplicatePrevClass);
      }
    }

    swiper.emitSlidesClasses();
  }

  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate
      ? swiper.translate
      : -swiper.translate;
    const {
      slidesGrid,
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex,
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;

    if (typeof activeIndex === "undefined") {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (
            translate >= slidesGrid[i] &&
            translate <
              slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2
          ) {
            activeIndex = i;
          } else if (
            translate >= slidesGrid[i] &&
            translate < slidesGrid[i + 1]
          ) {
            activeIndex = i + 1;
          }
        } else if (translate >= slidesGrid[i]) {
          activeIndex = i;
        }
      } // Normalize slideIndex

      if (params.normalizeSlideIndex) {
        if (activeIndex < 0 || typeof activeIndex === "undefined")
          activeIndex = 0;
      }
    }

    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex =
        skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }

    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if (activeIndex === previousIndex) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }

      return;
    } // Get real index

    const realIndex = parseInt(
      swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") ||
        activeIndex,
      10
    );
    Object.assign(swiper, {
      snapIndex,
      realIndex,
      previousIndex,
      activeIndex,
    });
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");

    if (previousRealIndex !== realIndex) {
      swiper.emit("realIndexChange");
    }

    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      swiper.emit("slideChange");
    }
  }

  function updateClickedSlide(e) {
    const swiper = this;
    const params = swiper.params;
    const slide = $(e).closest(`.${params.slideClass}`)[0];
    let slideFound = false;
    let slideIndex;

    if (slide) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }

    if (slide && slideFound) {
      swiper.clickedSlide = slide;

      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(
          $(slide).attr("data-swiper-slide-index"),
          10
        );
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = undefined;
      swiper.clickedIndex = undefined;
      return;
    }

    if (
      params.slideToClickedSlide &&
      swiper.clickedIndex !== undefined &&
      swiper.clickedIndex !== swiper.activeIndex
    ) {
      swiper.slideToClickedSlide();
    }
  }

  var update = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide,
  };

  function getSwiperTranslate(axis) {
    if (axis === void 0) {
      axis = this.isHorizontal() ? "x" : "y";
    }

    const swiper = this;
    const { params, rtlTranslate: rtl, translate, $wrapperEl } = swiper;

    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }

    if (params.cssMode) {
      return translate;
    }

    let currentTranslate = getTranslate($wrapperEl[0], axis);
    if (rtl) currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }

  function setTranslate(translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      $wrapperEl,
      wrapperEl,
      progress,
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;

    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }

    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }

    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] =
        swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
    }

    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / translatesDiff;
    }

    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }

    swiper.emit("setTranslate", swiper.translate, byController);
  }

  function minTranslate() {
    return -this.snapGrid[0];
  }

  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }

  function translateTo(
    translate,
    speed,
    runCallbacks,
    translateBounds,
    internal
  ) {
    if (translate === void 0) {
      translate = 0;
    }

    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    if (translateBounds === void 0) {
      translateBounds = true;
    }

    const swiper = this;
    const { params, wrapperEl } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate)
      newTranslate = minTranslate;
    else if (translateBounds && translate < maxTranslate)
      newTranslate = maxTranslate;
    else newTranslate = translate; // Update progress

    swiper.updateProgress(newTranslate);

    if (params.cssMode) {
      const isH = swiper.isHorizontal();

      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top",
          });
          return true;
        }

        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth",
        });
      }

      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);

      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);

      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }

      if (!swiper.animating) {
        swiper.animating = true;

        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener(
              "transitionend",
              swiper.onTranslateToWrapperTransitionEnd
            );
            swiper.$wrapperEl[0].removeEventListener(
              "webkitTransitionEnd",
              swiper.onTranslateToWrapperTransitionEnd
            );
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;

            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }

        swiper.$wrapperEl[0].addEventListener(
          "transitionend",
          swiper.onTranslateToWrapperTransitionEnd
        );
        swiper.$wrapperEl[0].addEventListener(
          "webkitTransitionEnd",
          swiper.onTranslateToWrapperTransitionEnd
        );
      }
    }

    return true;
  }

  var translate = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo,
  };

  function setTransition(duration, byController) {
    const swiper = this;

    if (!swiper.params.cssMode) {
      swiper.$wrapperEl.transition(duration);
    }

    swiper.emit("setTransition", duration, byController);
  }

  function transitionEmit(_ref) {
    let { swiper, runCallbacks, direction, step } = _ref;
    const { activeIndex, previousIndex } = swiper;
    let dir = direction;

    if (!dir) {
      if (activeIndex > previousIndex) dir = "next";
      else if (activeIndex < previousIndex) dir = "prev";
      else dir = "reset";
    }

    swiper.emit(`transition${step}`);

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === "reset") {
        swiper.emit(`slideResetTransition${step}`);
        return;
      }

      swiper.emit(`slideChangeTransition${step}`);

      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }

  function transitionStart(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    const { params } = swiper;
    if (params.cssMode) return;

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "Start",
    });
  }

  function transitionEnd(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    const { params } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "End",
    });
  }

  var transition = {
    setTransition,
    transitionStart,
    transitionEnd,
  };

  function slideTo(index, speed, runCallbacks, internal, initial) {
    if (index === void 0) {
      index = 0;
    }

    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    if (typeof index !== "number" && typeof index !== "string") {
      throw new Error(
        `The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`
      );
    }

    if (typeof index === "string") {
      /**
       * The `index` argument converted from `string` to `number`.
       * @type {number}
       */
      const indexAsNumber = parseInt(index, 10);
      /**
       * Determines whether the `index` argument is a valid `number`
       * after being converted from the `string` type.
       * @type {boolean}
       */

      const isValidNumber = isFinite(indexAsNumber);

      if (!isValidNumber) {
        throw new Error(
          `The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`
        );
      } // Knowing that the converted `index` is a valid number,
      // we can update the original argument's value.

      index = indexAsNumber;
    }

    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled,
    } = swiper;

    if (
      (swiper.animating && params.preventInteractionOnTransition) ||
      (!enabled && !internal && !initial)
    ) {
      return false;
    }

    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex =
      skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if (
      (activeIndex || params.initialSlide || 0) === (previousIndex || 0) &&
      runCallbacks
    ) {
      swiper.emit("beforeSlideChangeStart");
    }

    const translate = -snapGrid[snapIndex]; // Update progress

    swiper.updateProgress(translate); // Normalize slideIndex

    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (
            normalizedTranslate >= normalizedGrid &&
            normalizedTranslate <
              normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2
          ) {
            slideIndex = i;
          } else if (
            normalizedTranslate >= normalizedGrid &&
            normalizedTranslate < normalizedGridNext
          ) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    } // Directions locks

    if (swiper.initialized && slideIndex !== activeIndex) {
      if (
        !swiper.allowSlideNext &&
        translate < swiper.translate &&
        translate < swiper.minTranslate()
      ) {
        return false;
      }

      if (
        !swiper.allowSlidePrev &&
        translate > swiper.translate &&
        translate > swiper.maxTranslate()
      ) {
        if ((activeIndex || 0) !== slideIndex) return false;
      }
    }

    let direction;
    if (slideIndex > activeIndex) direction = "next";
    else if (slideIndex < activeIndex) direction = "prev";
    else direction = "reset"; // Update Index

    if (
      (rtl && -translate === swiper.translate) ||
      (!rtl && translate === swiper.translate)
    ) {
      swiper.updateActiveIndex(slideIndex); // Update Height

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      swiper.updateSlidesClasses();

      if (params.effect !== "slide") {
        swiper.setTranslate(translate);
      }

      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }

      return false;
    }

    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate : -translate;

      if (speed === 0) {
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }

        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;

        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._swiperImmediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t,
            side: isH ? "left" : "top",
          });
          return true;
        }

        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t,
          behavior: "smooth",
        });
      }

      return true;
    }

    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);

    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener(
            "transitionend",
            swiper.onSlideToWrapperTransitionEnd
          );
          swiper.$wrapperEl[0].removeEventListener(
            "webkitTransitionEnd",
            swiper.onSlideToWrapperTransitionEnd
          );
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }

      swiper.$wrapperEl[0].addEventListener(
        "transitionend",
        swiper.onSlideToWrapperTransitionEnd
      );
      swiper.$wrapperEl[0].addEventListener(
        "webkitTransitionEnd",
        swiper.onSlideToWrapperTransitionEnd
      );
    }

    return true;
  }

  function slideToLoop(index, speed, runCallbacks, internal) {
    if (index === void 0) {
      index = 0;
    }

    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    let newIndex = index;

    if (swiper.params.loop) {
      newIndex += swiper.loopedSlides;
    }

    return swiper.slideTo(newIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideNext(speed, runCallbacks, internal) {
    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    const { animating, enabled, params } = swiper;
    if (!enabled) return swiper;
    let perGroup = params.slidesPerGroup;

    if (
      params.slidesPerView === "auto" &&
      params.slidesPerGroup === 1 &&
      params.slidesPerGroupAuto
    ) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }

    const increment =
      swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

    if (params.loop) {
      if (animating && params.loopPreventsSlide) return false;
      swiper.loopFix(); // eslint-disable-next-line

      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }

    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }

    return swiper.slideTo(
      swiper.activeIndex + increment,
      speed,
      runCallbacks,
      internal
    );
  }

  /* eslint no-unused-vars: "off" */
  function slidePrev(speed, runCallbacks, internal) {
    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    const { params, animating, snapGrid, slidesGrid, rtlTranslate, enabled } =
      swiper;
    if (!enabled) return swiper;

    if (params.loop) {
      if (animating && params.loopPreventsSlide) return false;
      swiper.loopFix(); // eslint-disable-next-line

      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }

    const translate = rtlTranslate ? swiper.translate : -swiper.translate;

    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }

    const normalizedTranslate = normalize(translate);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    let prevSnap =
      snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

    if (typeof prevSnap === "undefined" && params.cssMode) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          // prevSnap = snap;
          prevSnapIndex = snapIndex;
        }
      });

      if (typeof prevSnapIndex !== "undefined") {
        prevSnap =
          snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }

    let prevIndex = 0;

    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

      if (
        params.slidesPerView === "auto" &&
        params.slidesPerGroup === 1 &&
        params.slidesPerGroupAuto
      ) {
        prevIndex =
          prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }

    if (params.rewind && swiper.isBeginning) {
      const lastIndex =
        swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual
          ? swiper.virtual.slides.length - 1
          : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    }

    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideReset(speed, runCallbacks, internal) {
    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    const swiper = this;
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideToClosest(speed, runCallbacks, internal, threshold) {
    if (speed === void 0) {
      speed = this.params.speed;
    }

    if (runCallbacks === void 0) {
      runCallbacks = true;
    }

    if (threshold === void 0) {
      threshold = 0.5;
    }

    const swiper = this;
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex =
      skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate = swiper.rtlTranslate
      ? swiper.translate
      : -swiper.translate;

    if (translate >= swiper.snapGrid[snapIndex]) {
      // The current translate is on or after the current snap index, so the choice
      // is between the current index and the one after it.
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];

      if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      // The current translate is before the current snap index, so the choice
      // is between the current index and the one before it.
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];

      if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }

    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }

  function slideToClickedSlide() {
    const swiper = this;
    const { params, $wrapperEl } = swiper;
    const slidesPerView =
      params.slidesPerView === "auto"
        ? swiper.slidesPerViewDynamic()
        : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;

    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt(
        $(swiper.clickedSlide).attr("data-swiper-slide-index"),
        10
      );

      if (params.centeredSlides) {
        if (
          slideToIndex < swiper.loopedSlides - slidesPerView / 2 ||
          slideToIndex >
            swiper.slides.length - swiper.loopedSlides + slidesPerView / 2
        ) {
          swiper.loopFix();
          slideToIndex = $wrapperEl
            .children(
              `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`
            )
            .eq(0)
            .index();
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = $wrapperEl
          .children(
            `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`
          )
          .eq(0)
          .index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }

  var slide = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide,
  };

  function loopCreate() {
    const swiper = this;
    const document = getDocument();
    const { params, $wrapperEl } = swiper; // Remove duplicated slides

    const $selector =
      $wrapperEl.children().length > 0
        ? $($wrapperEl.children()[0].parentNode)
        : $wrapperEl;
    $selector
      .children(`.${params.slideClass}.${params.slideDuplicateClass}`)
      .remove();
    let slides = $selector.children(`.${params.slideClass}`);

    if (params.loopFillGroupWithBlank) {
      const blankSlidesNum =
        params.slidesPerGroup - (slides.length % params.slidesPerGroup);

      if (blankSlidesNum !== params.slidesPerGroup) {
        for (let i = 0; i < blankSlidesNum; i += 1) {
          const blankNode = $(document.createElement("div")).addClass(
            `${params.slideClass} ${params.slideBlankClass}`
          );
          $selector.append(blankNode);
        }

        slides = $selector.children(`.${params.slideClass}`);
      }
    }

    if (params.slidesPerView === "auto" && !params.loopedSlides)
      params.loopedSlides = slides.length;
    swiper.loopedSlides = Math.ceil(
      parseFloat(params.loopedSlides || params.slidesPerView, 10)
    );
    swiper.loopedSlides += params.loopAdditionalSlides;

    if (swiper.loopedSlides > slides.length) {
      swiper.loopedSlides = slides.length;
    }

    const prependSlides = [];
    const appendSlides = [];
    slides.each((el, index) => {
      const slide = $(el);

      if (index < swiper.loopedSlides) {
        appendSlides.push(el);
      }

      if (
        index < slides.length &&
        index >= slides.length - swiper.loopedSlides
      ) {
        prependSlides.push(el);
      }

      slide.attr("data-swiper-slide-index", index);
    });

    for (let i = 0; i < appendSlides.length; i += 1) {
      $selector.append(
        $(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass)
      );
    }

    for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
      $selector.prepend(
        $(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass)
      );
    }
  }

  function loopFix() {
    const swiper = this;
    swiper.emit("beforeLoopFix");
    const {
      activeIndex,
      slides,
      loopedSlides,
      allowSlidePrev,
      allowSlideNext,
      snapGrid,
      rtlTranslate: rtl,
    } = swiper;
    let newIndex;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    const snapTranslate = -snapGrid[activeIndex];
    const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

    if (activeIndex < loopedSlides) {
      newIndex = slides.length - loopedSlides * 3 + activeIndex;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);

      if (slideChanged && diff !== 0) {
        swiper.setTranslate(
          (rtl ? -swiper.translate : swiper.translate) - diff
        );
      }
    } else if (activeIndex >= slides.length - loopedSlides) {
      // Fix For Positive Oversliding
      newIndex = -slides.length + activeIndex + loopedSlides;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);

      if (slideChanged && diff !== 0) {
        swiper.setTranslate(
          (rtl ? -swiper.translate : swiper.translate) - diff
        );
      }
    }

    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit("loopFix");
  }

  function loopDestroy() {
    const swiper = this;
    const { $wrapperEl, params, slides } = swiper;
    $wrapperEl
      .children(
        `.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`
      )
      .remove();
    slides.removeAttr("data-swiper-slide-index");
  }

  var loop = {
    loopCreate,
    loopFix,
    loopDestroy,
  };

  function setGrabCursor(moving) {
    const swiper = this;
    if (
      swiper.support.touch ||
      !swiper.params.simulateTouch ||
      (swiper.params.watchOverflow && swiper.isLocked) ||
      swiper.params.cssMode
    )
      return;
    const el =
      swiper.params.touchEventsTarget === "container"
        ? swiper.el
        : swiper.wrapperEl;
    el.style.cursor = "move";
    el.style.cursor = moving ? "-webkit-grabbing" : "-webkit-grab";
    el.style.cursor = moving ? "-moz-grabbin" : "-moz-grab";
    el.style.cursor = moving ? "grabbing" : "grab";
  }

  function unsetGrabCursor() {
    const swiper = this;

    if (
      swiper.support.touch ||
      (swiper.params.watchOverflow && swiper.isLocked) ||
      swiper.params.cssMode
    ) {
      return;
    }

    swiper[
      swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"
    ].style.cursor = "";
  }

  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor,
  };

  function closestElement(selector, base) {
    if (base === void 0) {
      base = this;
    }

    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow()) return null;
      if (el.assignedSlot) el = el.assignedSlot;
      const found = el.closest(selector);
      return found || __closestFrom(el.getRootNode().host);
    }

    return __closestFrom(base);
  }

  function onTouchStart(event) {
    const swiper = this;
    const document = getDocument();
    const window = getWindow();
    const data = swiper.touchEventsData;
    const { params, touches, enabled } = swiper;
    if (!enabled) return;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }

    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }

    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    let $targetEl = $(e.target);

    if (params.touchEventsTarget === "wrapper") {
      if (!$targetEl.closest(swiper.wrapperEl).length) return;
    }

    data.isTouchEvent = e.type === "touchstart";
    if (!data.isTouchEvent && "which" in e && e.which === 3) return;
    if (!data.isTouchEvent && "button" in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return; // change target el for shadow root component

    const swipingClassHasValue =
      !!params.noSwipingClass && params.noSwipingClass !== "";

    if (
      swipingClassHasValue &&
      e.target &&
      e.target.shadowRoot &&
      event.path &&
      event.path[0]
    ) {
      $targetEl = $(event.path[0]);
    }

    const noSwipingSelector = params.noSwipingSelector
      ? params.noSwipingSelector
      : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

    if (
      params.noSwiping &&
      (isTargetShadow
        ? closestElement(noSwipingSelector, e.target)
        : $targetEl.closest(noSwipingSelector)[0])
    ) {
      swiper.allowClick = true;
      return;
    }

    if (params.swipeHandler) {
      if (!$targetEl.closest(params.swipeHandler)[0]) return;
    }

    touches.currentX =
      e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
    touches.currentY =
      e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

    const edgeSwipeDetection =
      params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
    const edgeSwipeThreshold =
      params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

    if (
      edgeSwipeDetection &&
      (startX <= edgeSwipeThreshold ||
        startX >= window.innerWidth - edgeSwipeThreshold)
    ) {
      if (edgeSwipeDetection === "prevent") {
        event.preventDefault();
      } else {
        return;
      }
    }

    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: undefined,
      startMoving: undefined,
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = undefined;
    if (params.threshold > 0) data.allowThresholdMove = false;

    if (e.type !== "touchstart") {
      let preventDefault = true;

      if ($targetEl.is(data.focusableElements)) {
        preventDefault = false;

        if ($targetEl[0].nodeName === "SELECT") {
          data.isTouched = false;
        }
      }

      if (
        document.activeElement &&
        $(document.activeElement).is(data.focusableElements) &&
        document.activeElement !== $targetEl[0]
      ) {
        document.activeElement.blur();
      }

      const shouldPreventDefault =
        preventDefault &&
        swiper.allowTouchMove &&
        params.touchStartPreventDefault;

      if (
        (params.touchStartForcePreventDefault || shouldPreventDefault) &&
        !$targetEl[0].isContentEditable
      ) {
        e.preventDefault();
      }
    }

    if (
      swiper.params.freeMode &&
      swiper.params.freeMode.enabled &&
      swiper.freeMode &&
      swiper.animating &&
      !params.cssMode
    ) {
      swiper.freeMode.onTouchStart();
    }

    swiper.emit("touchStart", e);
  }

  function onTouchMove(event) {
    const document = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches, rtlTranslate: rtl, enabled } = swiper;
    if (!enabled) return;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;

    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e);
      }

      return;
    }

    if (data.isTouchEvent && e.type !== "touchmove") return;
    const targetTouch =
      e.type === "touchmove" &&
      e.targetTouches &&
      (e.targetTouches[0] || e.changedTouches[0]);
    const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
    const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;

    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }

    if (!swiper.allowTouchMove) {
      if (!$(e.target).is(data.focusableElements)) {
        swiper.allowClick = false;
      }

      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY,
        });
        data.touchStartTime = now();
      }

      return;
    }

    if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        // Vertical
        if (
          (pageY < touches.startY &&
            swiper.translate <= swiper.maxTranslate()) ||
          (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
        ) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (
        (pageX < touches.startX && swiper.translate <= swiper.maxTranslate()) ||
        (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
      ) {
        return;
      }
    }

    if (data.isTouchEvent && document.activeElement) {
      if (
        e.target === document.activeElement &&
        $(e.target).is(data.focusableElements)
      ) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }

    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e);
    }

    if (e.targetTouches && e.targetTouches.length > 1) return;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (
      swiper.params.threshold &&
      Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold
    )
      return;

    if (typeof data.isScrolling === "undefined") {
      let touchAngle;

      if (
        (swiper.isHorizontal() && touches.currentY === touches.startY) ||
        (swiper.isVertical() && touches.currentX === touches.startX)
      ) {
        data.isScrolling = false;
      } else {
        // eslint-disable-next-line
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle =
            (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
          data.isScrolling = swiper.isHorizontal()
            ? touchAngle > params.touchAngle
            : 90 - touchAngle > params.touchAngle;
        }
      }
    }

    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }

    if (typeof data.startMoving === "undefined") {
      if (
        touches.currentX !== touches.startX ||
        touches.currentY !== touches.startY
      ) {
        data.startMoving = true;
      }
    }

    if (data.isScrolling) {
      data.isTouched = false;
      return;
    }

    if (!data.startMoving) {
      return;
    }

    swiper.allowClick = false;

    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }

    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }

    if (!data.isMoved) {
      if (params.loop && !params.cssMode) {
        swiper.loopFix();
      }

      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);

      if (swiper.animating) {
        swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
      }

      data.allowMomentumBounce = false; // Grab Cursor

      if (
        params.grabCursor &&
        (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)
      ) {
        swiper.setGrabCursor(true);
      }

      swiper.emit("sliderFirstMove", e);
    }

    swiper.emit("sliderMove", e);
    data.isMoved = true;
    let diff = swiper.isHorizontal() ? diffX : diffY;
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) diff = -diff;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;

    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }

    if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance)
        data.currentTranslate =
          swiper.minTranslate() -
          1 +
          (-swiper.minTranslate() + data.startTranslate + diff) **
            resistanceRatio;
    } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance)
        data.currentTranslate =
          swiper.maxTranslate() +
          1 -
          (swiper.maxTranslate() - data.startTranslate - diff) **
            resistanceRatio;
    }

    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    } // Directions locks

    if (
      !swiper.allowSlideNext &&
      swiper.swipeDirection === "next" &&
      data.currentTranslate < data.startTranslate
    ) {
      data.currentTranslate = data.startTranslate;
    }

    if (
      !swiper.allowSlidePrev &&
      swiper.swipeDirection === "prev" &&
      data.currentTranslate > data.startTranslate
    ) {
      data.currentTranslate = data.startTranslate;
    }

    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    } // Threshold

    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal()
            ? touches.currentX - touches.startX
            : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }

    if (!params.followFinger || params.cssMode) return; // Update active index in free mode

    if (
      (params.freeMode && params.freeMode.enabled && swiper.freeMode) ||
      params.watchSlidesProgress
    ) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    } // Update progress

    swiper.updateProgress(data.currentTranslate); // Update translate

    swiper.setTranslate(data.currentTranslate);
  }

  function onTouchEnd(event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
    if (!enabled) return;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;

    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e);
    }

    data.allowTouchCallbacks = false;

    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }

      data.isMoved = false;
      data.startMoving = false;
      return;
    } // Return Grab Cursor

    if (
      params.grabCursor &&
      data.isMoved &&
      data.isTouched &&
      (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)
    ) {
      swiper.setGrabCursor(false);
    } // Time diff

    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

    if (swiper.allowClick) {
      const pathTree = e.path || (e.composedPath && e.composedPath());
      swiper.updateClickedSlide((pathTree && pathTree[0]) || e.target);
      swiper.emit("tap click", e);

      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e);
      }
    }

    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });

    if (
      !data.isTouched ||
      !data.isMoved ||
      !swiper.swipeDirection ||
      touches.diff === 0 ||
      data.currentTranslate === data.startTranslate
    ) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }

    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;

    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }

    if (params.cssMode) {
      return;
    }

    if (swiper.params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos,
      });
      return;
    } // Find current slide

    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];

    for (
      let i = 0;
      i < slidesGrid.length;
      i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup
    ) {
      const increment =
        i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (typeof slidesGrid[i + increment] !== "undefined") {
        if (
          currentPos >= slidesGrid[i] &&
          currentPos < slidesGrid[i + increment]
        ) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment] - slidesGrid[i];
        }
      } else if (currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize =
          slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }

    let rewindFirstIndex = null;
    let rewindLastIndex = null;

    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex =
          swiper.params.virtual &&
          swiper.params.virtual.enabled &&
          swiper.virtual
            ? swiper.virtual.slides.length - 1
            : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    } // Find current slide size

    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment =
      stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

    if (timeDiff > params.longSwipesMs) {
      // Long touches
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }

      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio)
          swiper.slideTo(
            params.rewind && swiper.isEnd
              ? rewindFirstIndex
              : stopIndex + increment
          );
        else swiper.slideTo(stopIndex);
      }

      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (
          rewindLastIndex !== null &&
          ratio < 0 &&
          Math.abs(ratio) > params.longSwipesRatio
        ) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      // Short swipes
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }

      const isNavButtonTarget =
        swiper.navigation &&
        (e.target === swiper.navigation.nextEl ||
          e.target === swiper.navigation.prevEl);

      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(
            rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment
          );
        }

        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(
            rewindLastIndex !== null ? rewindLastIndex : stopIndex
          );
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }

  function onResize() {
    const swiper = this;
    const { params, el } = swiper;
    if (el && el.offsetWidth === 0) return; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    } // Save locks

    const { allowSlideNext, allowSlidePrev, snapGrid } = swiper; // Disable locks on resize

    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();

    if (
      (params.slidesPerView === "auto" || params.slidesPerView > 1) &&
      swiper.isEnd &&
      !swiper.isBeginning &&
      !swiper.params.centeredSlides
    ) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }

    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      swiper.autoplay.run();
    } // Return locks after resize

    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;

    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled) return;

    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();

      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }

  function onScroll() {
    const swiper = this;
    const { wrapperEl, rtlTranslate, enabled } = swiper;
    if (!enabled) return;
    swiper.previousTranslate = swiper.translate;

    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    } // eslint-disable-next-line

    if (swiper.translate === -0) swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }

    if (newProgress !== swiper.progress) {
      swiper.updateProgress(
        rtlTranslate ? -swiper.translate : swiper.translate
      );
    }

    swiper.emit("setTranslate", swiper.translate, false);
  }

  let dummyEventAttached = false;

  function dummyEventListener() {}

  const events = (swiper, method) => {
    const document = getDocument();
    const { params, touchEvents, el, wrapperEl, device, support } = swiper;
    const capture = !!params.nested;
    const domMethod =
      method === "on" ? "addEventListener" : "removeEventListener";
    const swiperMethod = method; // Touch Events

    if (!support.touch) {
      el[domMethod](touchEvents.start, swiper.onTouchStart, false);
      document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
      document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
    } else {
      const passiveListener =
        touchEvents.start === "touchstart" &&
        support.passiveListener &&
        params.passiveListeners
          ? {
              passive: true,
              capture: false,
            }
          : false;
      el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
      el[domMethod](
        touchEvents.move,
        swiper.onTouchMove,
        support.passiveListener
          ? {
              passive: false,
              capture,
            }
          : capture
      );
      el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

      if (touchEvents.cancel) {
        el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
      }
    } // Prevent Links Clicks

    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]("click", swiper.onClick, true);
    }

    if (params.cssMode) {
      wrapperEl[domMethod]("scroll", swiper.onScroll);
    } // Resize handler

    if (params.updateOnWindowResize) {
      swiper[swiperMethod](
        device.ios || device.android
          ? "resize orientationchange observerUpdate"
          : "resize observerUpdate",
        onResize,
        true
      );
    } else {
      swiper[swiperMethod]("observerUpdate", onResize, true);
    }
  };

  function attachEvents() {
    const swiper = this;
    const document = getDocument();
    const { params, support } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);

    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }

    swiper.onClick = onClick.bind(swiper);

    if (support.touch && !dummyEventAttached) {
      document.addEventListener("touchstart", dummyEventListener);
      dummyEventAttached = true;
    }

    events(swiper, "on");
  }

  function detachEvents() {
    const swiper = this;
    events(swiper, "off");
  }

  var events$1 = {
    attachEvents,
    detachEvents,
  };

  const isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };

  function setBreakpoint() {
    const swiper = this;
    const { activeIndex, initialized, loopedSlides = 0, params, $el } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || (breakpoints && Object.keys(breakpoints).length === 0))
      return; // Get breakpoint for window width and update parameters

    const breakpoint = swiper.getBreakpoint(
      breakpoints,
      swiper.params.breakpointsBase,
      swiper.el
    );
    if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
    const breakpointOnlyParams =
      breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasEnabled = params.enabled;

    if (wasMultiRow && !isMultiRow) {
      $el.removeClass(
        `${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`
      );
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      $el.addClass(`${params.containerModifierClass}grid`);

      if (
        (breakpointParams.grid.fill &&
          breakpointParams.grid.fill === "column") ||
        (!breakpointParams.grid.fill && params.grid.fill === "column")
      ) {
        $el.addClass(`${params.containerModifierClass}grid-column`);
      }

      swiper.emitContainerClasses();
    }

    const directionChanged =
      breakpointParams.direction &&
      breakpointParams.direction !== params.direction;
    const needsReLoop =
      params.loop &&
      (breakpointParams.slidesPerView !== params.slidesPerView ||
        directionChanged);

    if (directionChanged && initialized) {
      swiper.changeDirection();
    }

    extend(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
    });

    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }

    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);

    if (needsReLoop && initialized) {
      swiper.loopDestroy();
      swiper.loopCreate();
      swiper.updateSlides();
      swiper.slideTo(
        activeIndex - loopedSlides + swiper.loopedSlides,
        0,
        false
      );
    }

    swiper.emit("breakpoint", breakpointParams);
  }

  function getBreakpoint(breakpoints, base, containerEl) {
    if (base === void 0) {
      base = "window";
    }

    if (!breakpoints || (base === "container" && !containerEl))
      return undefined;
    let breakpoint = false;
    const window = getWindow();
    const currentHeight =
      base === "window" ? window.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point,
        };
      }

      return {
        value: point,
        point,
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

    for (let i = 0; i < points.length; i += 1) {
      const { point, value } = points[i];

      if (base === "window") {
        if (window.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }

    return breakpoint || "max";
  }

  var breakpoints = {
    setBreakpoint,
    getBreakpoint,
  };

  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }

  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      $el,
      device,
      support
    } = swiper; // prettier-ignore

    const suffixes = prepareClasses(
      [
        "initialized",
        params.direction,
        {
          "pointer-events": !support.touch,
        },
        {
          "free-mode": swiper.params.freeMode && params.freeMode.enabled,
        },
        {
          autoheight: params.autoHeight,
        },
        {
          rtl: rtl,
        },
        {
          grid: params.grid && params.grid.rows > 1,
        },
        {
          "grid-column":
            params.grid &&
            params.grid.rows > 1 &&
            params.grid.fill === "column",
        },
        {
          android: device.android,
        },
        {
          ios: device.ios,
        },
        {
          "css-mode": params.cssMode,
        },
        {
          centered: params.cssMode && params.centeredSlides,
        },
      ],
      params.containerModifierClass
    );
    classNames.push(...suffixes);
    $el.addClass([...classNames].join(" "));
    swiper.emitContainerClasses();
  }

  function removeClasses() {
    const swiper = this;
    const { $el, classNames } = swiper;
    $el.removeClass(classNames.join(" "));
    swiper.emitContainerClasses();
  }

  var classes = {
    addClasses,
    removeClasses,
  };

  function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
    const window = getWindow();
    let image;

    function onReady() {
      if (callback) callback();
    }

    const isPicture = $(imageEl).parent("picture")[0];

    if (!isPicture && (!imageEl.complete || !checkForComplete)) {
      if (src) {
        image = new window.Image();
        image.onload = onReady;
        image.onerror = onReady;

        if (sizes) {
          image.sizes = sizes;
        }

        if (srcset) {
          image.srcset = srcset;
        }

        if (src) {
          image.src = src;
        }
      } else {
        onReady();
      }
    } else {
      // image already loaded...
      onReady();
    }
  }

  function preloadImages() {
    const swiper = this;
    swiper.imagesToLoad = swiper.$el.find("img");

    function onReady() {
      if (
        typeof swiper === "undefined" ||
        swiper === null ||
        !swiper ||
        swiper.destroyed
      )
        return;
      if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

      if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
        if (swiper.params.updateOnImagesReady) swiper.update();
        swiper.emit("imagesReady");
      }
    }

    for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
      const imageEl = swiper.imagesToLoad[i];
      swiper.loadImage(
        imageEl,
        imageEl.currentSrc || imageEl.getAttribute("src"),
        imageEl.srcset || imageEl.getAttribute("srcset"),
        imageEl.sizes || imageEl.getAttribute("sizes"),
        true,
        onReady
      );
    }
  }

  var images = {
    loadImage,
    preloadImages,
  };

  function checkOverflow() {
    const swiper = this;
    const { isLocked: wasLocked, params } = swiper;
    const { slidesOffsetBefore } = params;

    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge =
        swiper.slidesGrid[lastSlideIndex] +
        swiper.slidesSizesGrid[lastSlideIndex] +
        slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }

    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }

    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }

    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }

    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }

  var checkOverflow$1 = {
    checkOverflow,
  };

  var defaults = {
    init: true,
    direction: "horizontal",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    enabled: true,
    focusableElements: "input, select, option, textarea, button, video, label",
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: "slide",
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: undefined,
    breakpointsBase: "window",
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 0,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // Images
    preloadImages: true,
    updateOnImagesReady: true,
    // loop
    loop: false,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: false,
    loopPreventsSlide: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: "swiper-",
    // NEW
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false,
  };

  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj) {
      if (obj === void 0) {
        obj = {};
      }

      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];

      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend(allModulesParams, obj);
        return;
      }

      if (
        ["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >=
          0 &&
        params[moduleParamName] === true
      ) {
        params[moduleParamName] = {
          auto: true,
        };
      }

      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend(allModulesParams, obj);
        return;
      }

      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true,
        };
      }

      if (
        typeof params[moduleParamName] === "object" &&
        !("enabled" in params[moduleParamName])
      ) {
        params[moduleParamName].enabled = true;
      }

      if (!params[moduleParamName])
        params[moduleParamName] = {
          enabled: false,
        };
      extend(allModulesParams, obj);
    };
  }

  /* eslint no-param-reassign: "off" */
  const prototypes = {
    eventsEmitter,
    update,
    translate,
    transition,
    slide,
    loop,
    grabCursor,
    events: events$1,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes,
    images,
  };
  const extendedDefaults = {};

  class Swiper {
    constructor() {
      let el;
      let params;

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      if (
        args.length === 1 &&
        args[0].constructor &&
        Object.prototype.toString.call(args[0]).slice(8, -1) === "Object"
      ) {
        params = args[0];
      } else {
        [el, params] = args;
      }

      if (!params) params = {};
      params = extend({}, params);
      if (el && !params.el) params.el = el;

      if (params.el && $(params.el).length > 1) {
        const swipers = [];
        $(params.el).each((containerEl) => {
          const newParams = extend({}, params, {
            el: containerEl,
          });
          swipers.push(new Swiper(newParams));
        });
        return swipers;
      } // Swiper Instance

      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent,
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];

      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }

      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper),
        });
      }); // Extend defaults with modules params

      const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

      swiper.params = extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend({}, swiper.params);
      swiper.passedParams = extend({}, params); // add event listeners

      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach((eventName) => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }

      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      } // Save Dom lib

      swiper.$ = $; // Extend Swiper

      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: $(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],

        // isDirection
        isHorizontal() {
          return swiper.params.direction === "horizontal";
        },

        isVertical() {
          return swiper.params.direction === "vertical";
        },

        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEvents: (function touchEvents() {
          const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
          const desktop = ["pointerdown", "pointermove", "pointerup"];
          swiper.touchEventsTouch = {
            start: touch[0],
            move: touch[1],
            end: touch[2],
            cancel: touch[3],
          };
          swiper.touchEventsDesktop = {
            start: desktop[0],
            move: desktop[1],
            end: desktop[2],
          };
          return swiper.support.touch || !swiper.params.simulateTouch
            ? swiper.touchEventsTouch
            : swiper.touchEventsDesktop;
        })(),
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: now(),
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          isTouchEvent: undefined,
          startMoving: undefined,
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0,
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0,
      });
      swiper.emit("_swiper"); // Init

      if (swiper.params.init) {
        swiper.init();
      } // Return app instance

      return swiper;
    }

    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;

      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }

      swiper.emit("enable");
    }

    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;

      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }

      swiper.emit("disable");
    }

    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(" ").filter((className) => {
        return (
          className.indexOf("swiper") === 0 ||
          className.indexOf(swiper.params.containerModifierClass) === 0
        );
      });
      swiper.emit("_containerClasses", cls.join(" "));
    }

    getSlideClasses(slideEl) {
      const swiper = this;
      return slideEl.className
        .split(" ")
        .filter((className) => {
          return (
            className.indexOf("swiper-slide") === 0 ||
            className.indexOf(swiper.params.slideClass) === 0
          );
        })
        .join(" ");
    }

    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.each((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames,
        });
        swiper.emit("_slideClass", slideEl, classNames);
      });
      swiper.emit("_slideClasses", updates);
    }

    slidesPerViewDynamic(view, exact) {
      if (view === void 0) {
        view = "current";
      }

      if (exact === void 0) {
        exact = false;
      }

      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex,
      } = swiper;
      let spv = 1;

      if (params.centeredSlides) {
        let slideSize = slides[activeIndex].swiperSlideSize;
        let breakLoop;

        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }

        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        // eslint-disable-next-line
        if (view === "current") {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact
              ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] <
                swiperSize
              : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          // previous
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView =
              slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

            if (slideInView) {
              spv += 1;
            }
          }
        }
      }

      return spv;
    }

    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const { snapGrid, params } = swiper; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      }

      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      function setTranslate() {
        const translateValue = swiper.rtlTranslate
          ? swiper.translate * -1
          : swiper.translate;
        const newTranslate = Math.min(
          Math.max(translateValue, swiper.maxTranslate()),
          swiper.minTranslate()
        );
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      let translated;

      if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
        setTranslate();

        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if (
          (swiper.params.slidesPerView === "auto" ||
            swiper.params.slidesPerView > 1) &&
          swiper.isEnd &&
          !swiper.params.centeredSlides
        ) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }

        if (!translated) {
          setTranslate();
        }
      }

      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }

      swiper.emit("update");
    }

    changeDirection(newDirection, needUpdate) {
      if (needUpdate === void 0) {
        needUpdate = true;
      }

      const swiper = this;
      const currentDirection = swiper.params.direction;

      if (!newDirection) {
        // eslint-disable-next-line
        newDirection =
          currentDirection === "horizontal" ? "vertical" : "horizontal";
      }

      if (
        newDirection === currentDirection ||
        (newDirection !== "horizontal" && newDirection !== "vertical")
      ) {
        return swiper;
      }

      swiper.$el
        .removeClass(
          `${swiper.params.containerModifierClass}${currentDirection}`
        )
        .addClass(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.each((slideEl) => {
        if (newDirection === "vertical") {
          slideEl.style.width = "";
        } else {
          slideEl.style.height = "";
        }
      });
      swiper.emit("changeDirection");
      if (needUpdate) swiper.update();
      return swiper;
    }

    mount(el) {
      const swiper = this;
      if (swiper.mounted) return true; // Find el

      const $el = $(el || swiper.params.el);
      el = $el[0];

      if (!el) {
        return false;
      }

      el.swiper = swiper;

      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || "")
          .trim()
          .split(" ")
          .join(".")}`;
      };

      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

          res.children = (options) => $el.children(options);

          return res;
        }

        return $el.children(getWrapperSelector());
      }; // Find Wrapper

      let $wrapperEl = getWrapper();

      if ($wrapperEl.length === 0 && swiper.params.createElements) {
        const document = getDocument();
        const wrapper = document.createElement("div");
        $wrapperEl = $(wrapper);
        wrapper.className = swiper.params.wrapperClass;
        $el.append(wrapper);
        $el.children(`.${swiper.params.slideClass}`).each((slideEl) => {
          $wrapperEl.append(slideEl);
        });
      }

      Object.assign(swiper, {
        $el,
        el,
        $wrapperEl,
        wrapperEl: $wrapperEl[0],
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
        rtlTranslate:
          swiper.params.direction === "horizontal" &&
          (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
        wrongRTL: $wrapperEl.css("display") === "-webkit-box",
      });
      return true;
    }

    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit("beforeInit"); // Set breakpoint

      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      } // Add Classes

      swiper.addClasses(); // Create loop

      if (swiper.params.loop) {
        swiper.loopCreate();
      } // Update size

      swiper.updateSize(); // Update slides

      swiper.updateSlides();

      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      } // Set Grab Cursor

      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }

      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      } // Slide To Initial Slide

      if (swiper.params.loop) {
        swiper.slideTo(
          swiper.params.initialSlide + swiper.loopedSlides,
          0,
          swiper.params.runCallbacksOnInit,
          false,
          true
        );
      } else {
        swiper.slideTo(
          swiper.params.initialSlide,
          0,
          swiper.params.runCallbacksOnInit,
          false,
          true
        );
      } // Attach events

      swiper.attachEvents(); // Init Flag

      swiper.initialized = true; // Emit

      swiper.emit("init");
      swiper.emit("afterInit");
      return swiper;
    }

    destroy(deleteInstance, cleanStyles) {
      if (deleteInstance === void 0) {
        deleteInstance = true;
      }

      if (cleanStyles === void 0) {
        cleanStyles = true;
      }

      const swiper = this;
      const { params, $el, $wrapperEl, slides } = swiper;

      if (typeof swiper.params === "undefined" || swiper.destroyed) {
        return null;
      }

      swiper.emit("beforeDestroy"); // Init Flag

      swiper.initialized = false; // Detach events

      swiper.detachEvents(); // Destroy loop

      if (params.loop) {
        swiper.loopDestroy();
      } // Cleanup styles

      if (cleanStyles) {
        swiper.removeClasses();
        $el.removeAttr("style");
        $wrapperEl.removeAttr("style");

        if (slides && slides.length) {
          slides
            .removeClass(
              [
                params.slideVisibleClass,
                params.slideActiveClass,
                params.slideNextClass,
                params.slidePrevClass,
              ].join(" ")
            )
            .removeAttr("style")
            .removeAttr("data-swiper-slide-index");
        }
      }

      swiper.emit("destroy"); // Detach emitter events

      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });

      if (deleteInstance !== false) {
        swiper.$el[0].swiper = null;
        deleteProps(swiper);
      }

      swiper.destroyed = true;
      return null;
    }

    static extendDefaults(newDefaults) {
      extend(extendedDefaults, newDefaults);
    }

    static get extendedDefaults() {
      return extendedDefaults;
    }

    static get defaults() {
      return defaults;
    }

    static installModule(mod) {
      if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
      const modules = Swiper.prototype.__modules__;

      if (typeof mod === "function" && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }

    static use(module) {
      if (Array.isArray(module)) {
        module.forEach((m) => Swiper.installModule(m));
        return Swiper;
      }

      Swiper.installModule(module);
      return Swiper;
    }
  }

  Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer]);

  function Virtual(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    extendParams({
      virtual: {
        enabled: false,
        slides: [],
        cache: true,
        renderSlide: null,
        renderExternal: null,
        renderExternalUpdate: true,
        addSlidesBefore: 0,
        addSlidesAfter: 0,
      },
    });
    let cssModeTimeout;
    swiper.virtual = {
      cache: {},
      from: undefined,
      to: undefined,
      slides: [],
      offset: 0,
      slidesGrid: [],
    };

    function renderSlide(slide, index) {
      const params = swiper.params.virtual;

      if (params.cache && swiper.virtual.cache[index]) {
        return swiper.virtual.cache[index];
      }

      const $slideEl = params.renderSlide
        ? $(params.renderSlide.call(swiper, slide, index))
        : $(
            `<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`
          );
      if (!$slideEl.attr("data-swiper-slide-index"))
        $slideEl.attr("data-swiper-slide-index", index);
      if (params.cache) swiper.virtual.cache[index] = $slideEl;
      return $slideEl;
    }

    function update(force) {
      const { slidesPerView, slidesPerGroup, centeredSlides } = swiper.params;
      const { addSlidesBefore, addSlidesAfter } = swiper.params.virtual;
      const {
        from: previousFrom,
        to: previousTo,
        slides,
        slidesGrid: previousSlidesGrid,
        offset: previousOffset,
      } = swiper.virtual;

      if (!swiper.params.cssMode) {
        swiper.updateActiveIndex();
      }

      const activeIndex = swiper.activeIndex || 0;
      let offsetProp;
      if (swiper.rtlTranslate) offsetProp = "right";
      else offsetProp = swiper.isHorizontal() ? "left" : "top";
      let slidesAfter;
      let slidesBefore;

      if (centeredSlides) {
        slidesAfter =
          Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
        slidesBefore =
          Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
      } else {
        slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
        slidesBefore = slidesPerGroup + addSlidesBefore;
      }

      const from = Math.max((activeIndex || 0) - slidesBefore, 0);
      const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
      const offset =
        (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
      Object.assign(swiper.virtual, {
        from,
        to,
        offset,
        slidesGrid: swiper.slidesGrid,
      });

      function onRendered() {
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();

        if (swiper.lazy && swiper.params.lazy.enabled) {
          swiper.lazy.load();
        }

        emit("virtualUpdate");
      }

      if (previousFrom === from && previousTo === to && !force) {
        if (
          swiper.slidesGrid !== previousSlidesGrid &&
          offset !== previousOffset
        ) {
          swiper.slides.css(offsetProp, `${offset}px`);
        }

        swiper.updateProgress();
        emit("virtualUpdate");
        return;
      }

      if (swiper.params.virtual.renderExternal) {
        swiper.params.virtual.renderExternal.call(swiper, {
          offset,
          from,
          to,
          slides: (function getSlides() {
            const slidesToRender = [];

            for (let i = from; i <= to; i += 1) {
              slidesToRender.push(slides[i]);
            }

            return slidesToRender;
          })(),
        });

        if (swiper.params.virtual.renderExternalUpdate) {
          onRendered();
        } else {
          emit("virtualUpdate");
        }

        return;
      }

      const prependIndexes = [];
      const appendIndexes = [];

      if (force) {
        swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
      } else {
        for (let i = previousFrom; i <= previousTo; i += 1) {
          if (i < from || i > to) {
            swiper.$wrapperEl
              .find(
                `.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`
              )
              .remove();
          }
        }
      }

      for (let i = 0; i < slides.length; i += 1) {
        if (i >= from && i <= to) {
          if (typeof previousTo === "undefined" || force) {
            appendIndexes.push(i);
          } else {
            if (i > previousTo) appendIndexes.push(i);
            if (i < previousFrom) prependIndexes.push(i);
          }
        }
      }

      appendIndexes.forEach((index) => {
        swiper.$wrapperEl.append(renderSlide(slides[index], index));
      });
      prependIndexes
        .sort((a, b) => b - a)
        .forEach((index) => {
          swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
        });
      swiper.$wrapperEl
        .children(".swiper-slide")
        .css(offsetProp, `${offset}px`);
      onRendered();
    }

    function appendSlide(slides) {
      if (typeof slides === "object" && "length" in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) swiper.virtual.slides.push(slides[i]);
        }
      } else {
        swiper.virtual.slides.push(slides);
      }

      update(true);
    }

    function prependSlide(slides) {
      const activeIndex = swiper.activeIndex;
      let newActiveIndex = activeIndex + 1;
      let numberOfNewSlides = 1;

      if (Array.isArray(slides)) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
        }

        newActiveIndex = activeIndex + slides.length;
        numberOfNewSlides = slides.length;
      } else {
        swiper.virtual.slides.unshift(slides);
      }

      if (swiper.params.virtual.cache) {
        const cache = swiper.virtual.cache;
        const newCache = {};
        Object.keys(cache).forEach((cachedIndex) => {
          const $cachedEl = cache[cachedIndex];
          const cachedElIndex = $cachedEl.attr("data-swiper-slide-index");

          if (cachedElIndex) {
            $cachedEl.attr(
              "data-swiper-slide-index",
              parseInt(cachedElIndex, 10) + numberOfNewSlides
            );
          }

          newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
        });
        swiper.virtual.cache = newCache;
      }

      update(true);
      swiper.slideTo(newActiveIndex, 0);
    }

    function removeSlide(slidesIndexes) {
      if (typeof slidesIndexes === "undefined" || slidesIndexes === null)
        return;
      let activeIndex = swiper.activeIndex;

      if (Array.isArray(slidesIndexes)) {
        for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
          swiper.virtual.slides.splice(slidesIndexes[i], 1);

          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[slidesIndexes[i]];
          }

          if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }
      } else {
        swiper.virtual.slides.splice(slidesIndexes, 1);

        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes];
        }

        if (slidesIndexes < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }

      update(true);
      swiper.slideTo(activeIndex, 0);
    }

    function removeAllSlides() {
      swiper.virtual.slides = [];

      if (swiper.params.virtual.cache) {
        swiper.virtual.cache = {};
      }

      update(true);
      swiper.slideTo(0, 0);
    }

    on("beforeInit", () => {
      if (!swiper.params.virtual.enabled) return;
      swiper.virtual.slides = swiper.params.virtual.slides;
      swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;

      if (!swiper.params.initialSlide) {
        update();
      }
    });
    on("setTranslate", () => {
      if (!swiper.params.virtual.enabled) return;

      if (swiper.params.cssMode && !swiper._immediateVirtual) {
        clearTimeout(cssModeTimeout);
        cssModeTimeout = setTimeout(() => {
          update();
        }, 100);
      } else {
        update();
      }
    });
    on("init update resize", () => {
      if (!swiper.params.virtual.enabled) return;

      if (swiper.params.cssMode) {
        setCSSProperty(
          swiper.wrapperEl,
          "--swiper-virtual-size",
          `${swiper.virtualSize}px`
        );
      }
    });
    Object.assign(swiper.virtual, {
      appendSlide,
      prependSlide,
      removeSlide,
      removeAllSlides,
      update,
    });
  }

  /* eslint-disable consistent-return */
  function Keyboard(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const document = getDocument();
    const window = getWindow();
    swiper.keyboard = {
      enabled: false,
    };
    extendParams({
      keyboard: {
        enabled: false,
        onlyInViewport: true,
        pageUpDown: true,
      },
    });

    function handle(event) {
      if (!swiper.enabled) return;
      const { rtlTranslate: rtl } = swiper;
      let e = event;
      if (e.originalEvent) e = e.originalEvent; // jquery fix

      const kc = e.keyCode || e.charCode;
      const pageUpDown = swiper.params.keyboard.pageUpDown;
      const isPageUp = pageUpDown && kc === 33;
      const isPageDown = pageUpDown && kc === 34;
      const isArrowLeft = kc === 37;
      const isArrowRight = kc === 39;
      const isArrowUp = kc === 38;
      const isArrowDown = kc === 40; // Directions locks

      if (
        !swiper.allowSlideNext &&
        ((swiper.isHorizontal() && isArrowRight) ||
          (swiper.isVertical() && isArrowDown) ||
          isPageDown)
      ) {
        return false;
      }

      if (
        !swiper.allowSlidePrev &&
        ((swiper.isHorizontal() && isArrowLeft) ||
          (swiper.isVertical() && isArrowUp) ||
          isPageUp)
      ) {
        return false;
      }

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return undefined;
      }

      if (
        document.activeElement &&
        document.activeElement.nodeName &&
        (document.activeElement.nodeName.toLowerCase() === "input" ||
          document.activeElement.nodeName.toLowerCase() === "textarea")
      ) {
        return undefined;
      }

      if (
        swiper.params.keyboard.onlyInViewport &&
        (isPageUp ||
          isPageDown ||
          isArrowLeft ||
          isArrowRight ||
          isArrowUp ||
          isArrowDown)
      ) {
        let inView = false; // Check that swiper should be inside of visible area of window

        if (
          swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 &&
          swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0
        ) {
          return undefined;
        }

        const $el = swiper.$el;
        const swiperWidth = $el[0].clientWidth;
        const swiperHeight = $el[0].clientHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const swiperOffset = swiper.$el.offset();
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        const swiperCoord = [
          [swiperOffset.left, swiperOffset.top],
          [swiperOffset.left + swiperWidth, swiperOffset.top],
          [swiperOffset.left, swiperOffset.top + swiperHeight],
          [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight],
        ];

        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];

          if (
            point[0] >= 0 &&
            point[0] <= windowWidth &&
            point[1] >= 0 &&
            point[1] <= windowHeight
          ) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

            inView = true;
          }
        }

        if (!inView) return undefined;
      }

      if (swiper.isHorizontal()) {
        if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;
        }

        if (
          ((isPageDown || isArrowRight) && !rtl) ||
          ((isPageUp || isArrowLeft) && rtl)
        )
          swiper.slideNext();
        if (
          ((isPageUp || isArrowLeft) && !rtl) ||
          ((isPageDown || isArrowRight) && rtl)
        )
          swiper.slidePrev();
      } else {
        if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;
        }

        if (isPageDown || isArrowDown) swiper.slideNext();
        if (isPageUp || isArrowUp) swiper.slidePrev();
      }

      emit("keyPress", kc);
      return undefined;
    }

    function enable() {
      if (swiper.keyboard.enabled) return;
      $(document).on("keydown", handle);
      swiper.keyboard.enabled = true;
    }

    function disable() {
      if (!swiper.keyboard.enabled) return;
      $(document).off("keydown", handle);
      swiper.keyboard.enabled = false;
    }

    on("init", () => {
      if (swiper.params.keyboard.enabled) {
        enable();
      }
    });
    on("destroy", () => {
      if (swiper.keyboard.enabled) {
        disable();
      }
    });
    Object.assign(swiper.keyboard, {
      enable,
      disable,
    });
  }

  /* eslint-disable consistent-return */
  function Mousewheel(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const window = getWindow();
    extendParams({
      mousewheel: {
        enabled: false,
        releaseOnEdges: false,
        invert: false,
        forceToAxis: false,
        sensitivity: 1,
        eventsTarget: "container",
        thresholdDelta: null,
        thresholdTime: null,
      },
    });
    swiper.mousewheel = {
      enabled: false,
    };
    let timeout;
    let lastScrollTime = now();
    let lastEventBeforeSnap;
    const recentWheelEvents = [];

    function normalize(e) {
      // Reasonable defaults
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;
      let sX = 0;
      let sY = 0; // spinX, spinY

      let pX = 0;
      let pY = 0; // pixelX, pixelY
      // Legacy

      if ("detail" in e) {
        sY = e.detail;
      }

      if ("wheelDelta" in e) {
        sY = -e.wheelDelta / 120;
      }

      if ("wheelDeltaY" in e) {
        sY = -e.wheelDeltaY / 120;
      }

      if ("wheelDeltaX" in e) {
        sX = -e.wheelDeltaX / 120;
      } // side scrolling on FF with DOMMouseScroll

      if ("axis" in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }

      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;

      if ("deltaY" in e) {
        pY = e.deltaY;
      }

      if ("deltaX" in e) {
        pX = e.deltaX;
      }

      if (e.shiftKey && !pX) {
        // if user scrolls with shift he wants horizontal scroll
        pX = pY;
        pY = 0;
      }

      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          // delta in LINE units
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          // delta in PAGE units
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      } // Fall-back if spin cannot be determined

      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }

      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }

      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY,
      };
    }

    function handleMouseEnter() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = true;
    }

    function handleMouseLeave() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = false;
    }

    function animateSlider(newEvent) {
      if (
        swiper.params.mousewheel.thresholdDelta &&
        newEvent.delta < swiper.params.mousewheel.thresholdDelta
      ) {
        // Prevent if delta of wheel scroll delta is below configured threshold
        return false;
      }

      if (
        swiper.params.mousewheel.thresholdTime &&
        now() - lastScrollTime < swiper.params.mousewheel.thresholdTime
      ) {
        // Prevent if time between scrolls is below configured threshold
        return false;
      } // If the movement is NOT big enough and
      // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
      //   Don't go any further (avoid insignificant scroll movement).

      if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
        // Return false as a default
        return true;
      } // If user is scrolling towards the end:
      //   If the slider hasn't hit the latest slide or
      //   if the slider is a loop and
      //   if the slider isn't moving right now:
      //     Go to next slide and
      //     emit a scroll event.
      // Else (the user is scrolling towards the beginning) and
      // if the slider hasn't hit the first slide or
      // if the slider is a loop and
      // if the slider isn't moving right now:
      //   Go to prev slide and
      //   emit a scroll event.

      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.slideNext();
          emit("scroll", newEvent.raw);
        }
      } else if (
        (!swiper.isBeginning || swiper.params.loop) &&
        !swiper.animating
      ) {
        swiper.slidePrev();
        emit("scroll", newEvent.raw);
      } // If you got here is because an animation has been triggered so store the current time

      lastScrollTime = new window.Date().getTime(); // Return false as a default

      return false;
    }

    function releaseScroll(newEvent) {
      const params = swiper.params.mousewheel;

      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }
      } else if (
        swiper.isBeginning &&
        !swiper.params.loop &&
        params.releaseOnEdges
      ) {
        // Return true to animate scroll on edges
        return true;
      }

      return false;
    }

    function handle(event) {
      let e = event;
      let disableParentSwiper = true;
      if (!swiper.enabled) return;
      const params = swiper.params.mousewheel;

      if (swiper.params.cssMode) {
        e.preventDefault();
      }

      let target = swiper.$el;

      if (swiper.params.mousewheel.eventsTarget !== "container") {
        target = $(swiper.params.mousewheel.eventsTarget);
      }

      if (
        !swiper.mouseEntered &&
        !target[0].contains(e.target) &&
        !params.releaseOnEdges
      )
        return true;
      if (e.originalEvent) e = e.originalEvent; // jquery fix

      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;
      const data = normalize(e);

      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY))
            delta = -data.pixelX * rtlFactor;
          else return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX))
          delta = -data.pixelY;
        else return true;
      } else {
        delta =
          Math.abs(data.pixelX) > Math.abs(data.pixelY)
            ? -data.pixelX * rtlFactor
            : -data.pixelY;
      }

      if (delta === 0) return true;
      if (params.invert) delta = -delta; // Get the scroll positions

      let positions = swiper.getTranslate() + delta * params.sensitivity;
      if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
      if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
      //     the disableParentSwiper will be true.
      // When loop is false:
      //     if the scroll positions is not on edge,
      //     then the disableParentSwiper will be true.
      //     if the scroll on edge positions,
      //     then the disableParentSwiper will be false.

      disableParentSwiper = swiper.params.loop
        ? true
        : !(
            positions === swiper.minTranslate() ||
            positions === swiper.maxTranslate()
          );
      if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

      if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
        // Register the new event in a variable which stores the relevant data
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event,
        }; // Keep the most recent events

        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift(); // only store the last N events
        }

        const prevEvent = recentWheelEvents.length
          ? recentWheelEvents[recentWheelEvents.length - 1]
          : undefined;
        recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
        //   If direction has changed or
        //   if the scroll is quicker than the previous one:
        //     Animate the slider.
        // Else (this is the first time the wheel is moved):
        //     Animate the slider.

        if (prevEvent) {
          if (
            newEvent.direction !== prevEvent.direction ||
            newEvent.delta > prevEvent.delta ||
            newEvent.time > prevEvent.time + 150
          ) {
            animateSlider(newEvent);
          }
        } else {
          animateSlider(newEvent);
        } // If it's time to release the scroll:
        //   Return now so you don't hit the preventDefault.

        if (releaseScroll(newEvent)) {
          return true;
        }
      } else {
        // Freemode or scrollContainer:
        // If we recently snapped after a momentum scroll, then ignore wheel events
        // to give time for the deceleration to finish. Stop ignoring after 500 msecs
        // or if it's a new scroll (larger delta or inverse sign as last event before
        // an end-of-momentum snap).
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
        };
        const ignoreWheelEvents =
          lastEventBeforeSnap &&
          newEvent.time < lastEventBeforeSnap.time + 500 &&
          newEvent.delta <= lastEventBeforeSnap.delta &&
          newEvent.direction === lastEventBeforeSnap.direction;

        if (!ignoreWheelEvents) {
          lastEventBeforeSnap = undefined;

          if (swiper.params.loop) {
            swiper.loopFix();
          }

          let position = swiper.getTranslate() + delta * params.sensitivity;
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;
          if (position >= swiper.minTranslate())
            position = swiper.minTranslate();
          if (position <= swiper.maxTranslate())
            position = swiper.maxTranslate();
          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();

          if (
            (!wasBeginning && swiper.isBeginning) ||
            (!wasEnd && swiper.isEnd)
          ) {
            swiper.updateSlidesClasses();
          }

          if (swiper.params.freeMode.sticky) {
            // When wheel scrolling starts with sticky (aka snap) enabled, then detect
            // the end of a momentum scroll by storing recent (N=15?) wheel events.
            // 1. do all N events have decreasing or same (absolute value) delta?
            // 2. did all N events arrive in the last M (M=500?) msecs?
            // 3. does the earliest event have an (absolute value) delta that's
            //    at least P (P=1?) larger than the most recent event's delta?
            // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
            // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
            // Snap immediately and ignore remaining wheel events in this scroll.
            // See comment above for "remaining wheel events in this scroll" determination.
            // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
            clearTimeout(timeout);
            timeout = undefined;

            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift(); // only store the last N events
            }

            const prevEvent = recentWheelEvents.length
              ? recentWheelEvents[recentWheelEvents.length - 1]
              : undefined;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);

            if (
              prevEvent &&
              (newEvent.delta > prevEvent.delta ||
                newEvent.direction !== prevEvent.direction)
            ) {
              // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
              recentWheelEvents.splice(0);
            } else if (
              recentWheelEvents.length >= 15 &&
              newEvent.time - firstEvent.time < 500 &&
              firstEvent.delta - newEvent.delta >= 1 &&
              newEvent.delta <= 6
            ) {
              // We're at the end of the deceleration of a momentum scroll, so there's no need
              // to wait for more events. Snap ASAP on the next tick.
              // Also, because there's some remaining momentum we'll bias the snap in the
              // direction of the ongoing scroll because it's better UX for the scroll to snap
              // in the same direction as the scroll instead of reversing to snap.  Therefore,
              // if it's already scrolled more than 20% in the current direction, keep going.
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              timeout = nextTick(() => {
                swiper.slideToClosest(
                  swiper.params.speed,
                  true,
                  undefined,
                  snapToThreshold
                );
              }, 0); // no delay; move on next tick
            }

            if (!timeout) {
              // if we get here, then we haven't detected the end of a momentum scroll, so
              // we'll consider a scroll "complete" when there haven't been any wheel events
              // for 500ms.
              timeout = nextTick(() => {
                const snapToThreshold = 0.5;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.slideToClosest(
                  swiper.params.speed,
                  true,
                  undefined,
                  snapToThreshold
                );
              }, 500);
            }
          } // Emit event

          if (!ignoreWheelEvents) emit("scroll", e); // Stop autoplay

          if (
            swiper.params.autoplay &&
            swiper.params.autoplayDisableOnInteraction
          )
            swiper.autoplay.stop(); // Return page scroll on edge positions

          if (
            position === swiper.minTranslate() ||
            position === swiper.maxTranslate()
          )
            return true;
        }
      }

      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
      return false;
    }

    function events(method) {
      let target = swiper.$el;

      if (swiper.params.mousewheel.eventsTarget !== "container") {
        target = $(swiper.params.mousewheel.eventsTarget);
      }

      target[method]("mouseenter", handleMouseEnter);
      target[method]("mouseleave", handleMouseLeave);
      target[method]("wheel", handle);
    }

    function enable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener("wheel", handle);
        return true;
      }

      if (swiper.mousewheel.enabled) return false;
      events("on");
      swiper.mousewheel.enabled = true;
      return true;
    }

    function disable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, handle);
        return true;
      }

      if (!swiper.mousewheel.enabled) return false;
      events("off");
      swiper.mousewheel.enabled = false;
      return true;
    }

    on("init", () => {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        disable();
      }

      if (swiper.params.mousewheel.enabled) enable();
    });
    on("destroy", () => {
      if (swiper.params.cssMode) {
        enable();
      }

      if (swiper.mousewheel.enabled) disable();
    });
    Object.assign(swiper.mousewheel, {
      enable,
      disable,
    });
  }

  function createElementIfNotDefined(
    swiper,
    originalParams,
    params,
    checkProps
  ) {
    const document = getDocument();

    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach((key) => {
        if (!params[key] && params.auto === true) {
          let element = swiper.$el.children(`.${checkProps[key]}`)[0];

          if (!element) {
            element = document.createElement("div");
            element.className = checkProps[key];
            swiper.$el.append(element);
          }

          params[key] = element;
          originalParams[key] = element;
        }
      });
    }

    return params;
  }

  function Navigation(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
      },
    });
    swiper.navigation = {
      nextEl: null,
      $nextEl: null,
      prevEl: null,
      $prevEl: null,
    };

    function getEl(el) {
      let $el;

      if (el) {
        $el = $(el);

        if (
          swiper.params.uniqueNavElements &&
          typeof el === "string" &&
          $el.length > 1 &&
          swiper.$el.find(el).length === 1
        ) {
          $el = swiper.$el.find(el);
        }
      }

      return $el;
    }

    function toggleEl($el, disabled) {
      const params = swiper.params.navigation;

      if ($el && $el.length > 0) {
        $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
        if ($el[0] && $el[0].tagName === "BUTTON") $el[0].disabled = disabled;

        if (swiper.params.watchOverflow && swiper.enabled) {
          $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
      }
    }

    function update() {
      // Update Navigation Buttons
      if (swiper.params.loop) return;
      const { $nextEl, $prevEl } = swiper.navigation;
      toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
    }

    function onPrevClick(e) {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slidePrev();
    }

    function onNextClick(e) {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
      swiper.slideNext();
    }

    function init() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined(
        swiper,
        swiper.originalParams.navigation,
        swiper.params.navigation,
        {
          nextEl: "swiper-button-next",
          prevEl: "swiper-button-prev",
        }
      );
      if (!(params.nextEl || params.prevEl)) return;
      const $nextEl = getEl(params.nextEl);
      const $prevEl = getEl(params.prevEl);

      if ($nextEl && $nextEl.length > 0) {
        $nextEl.on("click", onNextClick);
      }

      if ($prevEl && $prevEl.length > 0) {
        $prevEl.on("click", onPrevClick);
      }

      Object.assign(swiper.navigation, {
        $nextEl,
        nextEl: $nextEl && $nextEl[0],
        $prevEl,
        prevEl: $prevEl && $prevEl[0],
      });

      if (!swiper.enabled) {
        if ($nextEl) $nextEl.addClass(params.lockClass);
        if ($prevEl) $prevEl.addClass(params.lockClass);
      }
    }

    function destroy() {
      const { $nextEl, $prevEl } = swiper.navigation;

      if ($nextEl && $nextEl.length) {
        $nextEl.off("click", onNextClick);
        $nextEl.removeClass(swiper.params.navigation.disabledClass);
      }

      if ($prevEl && $prevEl.length) {
        $prevEl.off("click", onPrevClick);
        $prevEl.removeClass(swiper.params.navigation.disabledClass);
      }
    }

    on("init", () => {
      init();
      update();
    });
    on("toEdge fromEdge lock unlock", () => {
      update();
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      const { $nextEl, $prevEl } = swiper.navigation;

      if ($nextEl) {
        $nextEl[swiper.enabled ? "removeClass" : "addClass"](
          swiper.params.navigation.lockClass
        );
      }

      if ($prevEl) {
        $prevEl[swiper.enabled ? "removeClass" : "addClass"](
          swiper.params.navigation.lockClass
        );
      }
    });
    on("click", (_s, e) => {
      const { $nextEl, $prevEl } = swiper.navigation;
      const targetEl = e.target;

      if (
        swiper.params.navigation.hideOnClick &&
        !$(targetEl).is($prevEl) &&
        !$(targetEl).is($nextEl)
      ) {
        if (
          swiper.pagination &&
          swiper.params.pagination &&
          swiper.params.pagination.clickable &&
          (swiper.pagination.el === targetEl ||
            swiper.pagination.el.contains(targetEl))
        )
          return;
        let isHidden;

        if ($nextEl) {
          isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
        } else if ($prevEl) {
          isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
        }

        if (isHidden === true) {
          emit("navigationShow");
        } else {
          emit("navigationHide");
        }

        if ($nextEl) {
          $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
        }

        if ($prevEl) {
          $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
        }
      }
    });
    Object.assign(swiper.navigation, {
      update,
      init,
      destroy,
    });
  }

  function classesToSelector(classes) {
    if (classes === void 0) {
      classes = "";
    }

    return `.${classes
      .trim()
      .replace(/([\.:!\/])/g, "\\$1") // eslint-disable-line
      .replace(/ /g, ".")}`;
  }

  function Pagination(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const pfx = "swiper-pagination";
    extendParams({
      pagination: {
        el: null,
        bulletElement: "span",
        clickable: false,
        hideOnClick: false,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: false,
        type: "bullets",
        // 'bullets' or 'progressbar' or 'fraction' or 'custom'
        dynamicBullets: false,
        dynamicMainBullets: 1,
        formatFractionCurrent: (number) => number,
        formatFractionTotal: (number) => number,
        bulletClass: `${pfx}-bullet`,
        bulletActiveClass: `${pfx}-bullet-active`,
        modifierClass: `${pfx}-`,
        currentClass: `${pfx}-current`,
        totalClass: `${pfx}-total`,
        hiddenClass: `${pfx}-hidden`,
        progressbarFillClass: `${pfx}-progressbar-fill`,
        progressbarOppositeClass: `${pfx}-progressbar-opposite`,
        clickableClass: `${pfx}-clickable`,
        lockClass: `${pfx}-lock`,
        horizontalClass: `${pfx}-horizontal`,
        verticalClass: `${pfx}-vertical`,
      },
    });
    swiper.pagination = {
      el: null,
      $el: null,
      bullets: [],
    };
    let bulletSize;
    let dynamicBulletIndex = 0;

    function isPaginationDisabled() {
      return (
        !swiper.params.pagination.el ||
        !swiper.pagination.el ||
        !swiper.pagination.$el ||
        swiper.pagination.$el.length === 0
      );
    }

    function setSideBullets($bulletEl, position) {
      const { bulletActiveClass } = swiper.params.pagination;
      $bulletEl[position]()
        .addClass(`${bulletActiveClass}-${position}`)
        [position]()
        .addClass(`${bulletActiveClass}-${position}-${position}`);
    }

    function update() {
      // Render || Update Pagination bullets/items
      const rtl = swiper.rtl;
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const slidesLength =
        swiper.virtual && swiper.params.virtual.enabled
          ? swiper.virtual.slides.length
          : swiper.slides.length;
      const $el = swiper.pagination.$el; // Current/Total

      let current;
      const total = swiper.params.loop
        ? Math.ceil(
            (slidesLength - swiper.loopedSlides * 2) /
              swiper.params.slidesPerGroup
          )
        : swiper.snapGrid.length;

      if (swiper.params.loop) {
        current = Math.ceil(
          (swiper.activeIndex - swiper.loopedSlides) /
            swiper.params.slidesPerGroup
        );

        if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
          current -= slidesLength - swiper.loopedSlides * 2;
        }

        if (current > total - 1) current -= total;
        if (current < 0 && swiper.params.paginationType !== "bullets")
          current = total + current;
      } else if (typeof swiper.snapIndex !== "undefined") {
        current = swiper.snapIndex;
      } else {
        current = swiper.activeIndex || 0;
      } // Types

      if (
        params.type === "bullets" &&
        swiper.pagination.bullets &&
        swiper.pagination.bullets.length > 0
      ) {
        const bullets = swiper.pagination.bullets;
        let firstIndex;
        let lastIndex;
        let midIndex;

        if (params.dynamicBullets) {
          bulletSize = bullets
            .eq(0)
            [swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
          $el.css(
            swiper.isHorizontal() ? "width" : "height",
            `${bulletSize * (params.dynamicMainBullets + 4)}px`
          );

          if (
            params.dynamicMainBullets > 1 &&
            swiper.previousIndex !== undefined
          ) {
            dynamicBulletIndex +=
              current - (swiper.previousIndex - swiper.loopedSlides || 0);

            if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
              dynamicBulletIndex = params.dynamicMainBullets - 1;
            } else if (dynamicBulletIndex < 0) {
              dynamicBulletIndex = 0;
            }
          }

          firstIndex = Math.max(current - dynamicBulletIndex, 0);
          lastIndex =
            firstIndex +
            (Math.min(bullets.length, params.dynamicMainBullets) - 1);
          midIndex = (lastIndex + firstIndex) / 2;
        }

        bullets.removeClass(
          ["", "-next", "-next-next", "-prev", "-prev-prev", "-main"]
            .map((suffix) => `${params.bulletActiveClass}${suffix}`)
            .join(" ")
        );

        if ($el.length > 1) {
          bullets.each((bullet) => {
            const $bullet = $(bullet);
            const bulletIndex = $bullet.index();

            if (bulletIndex === current) {
              $bullet.addClass(params.bulletActiveClass);
            }

            if (params.dynamicBullets) {
              if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                $bullet.addClass(`${params.bulletActiveClass}-main`);
              }

              if (bulletIndex === firstIndex) {
                setSideBullets($bullet, "prev");
              }

              if (bulletIndex === lastIndex) {
                setSideBullets($bullet, "next");
              }
            }
          });
        } else {
          const $bullet = bullets.eq(current);
          const bulletIndex = $bullet.index();
          $bullet.addClass(params.bulletActiveClass);

          if (params.dynamicBullets) {
            const $firstDisplayedBullet = bullets.eq(firstIndex);
            const $lastDisplayedBullet = bullets.eq(lastIndex);

            for (let i = firstIndex; i <= lastIndex; i += 1) {
              bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
            }

            if (swiper.params.loop) {
              if (bulletIndex >= bullets.length) {
                for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                  bullets
                    .eq(bullets.length - i)
                    .addClass(`${params.bulletActiveClass}-main`);
                }

                bullets
                  .eq(bullets.length - params.dynamicMainBullets - 1)
                  .addClass(`${params.bulletActiveClass}-prev`);
              } else {
                setSideBullets($firstDisplayedBullet, "prev");
                setSideBullets($lastDisplayedBullet, "next");
              }
            } else {
              setSideBullets($firstDisplayedBullet, "prev");
              setSideBullets($lastDisplayedBullet, "next");
            }
          }
        }

        if (params.dynamicBullets) {
          const dynamicBulletsLength = Math.min(
            bullets.length,
            params.dynamicMainBullets + 4
          );
          const bulletsOffset =
            (bulletSize * dynamicBulletsLength - bulletSize) / 2 -
            midIndex * bulletSize;
          const offsetProp = rtl ? "right" : "left";
          bullets.css(
            swiper.isHorizontal() ? offsetProp : "top",
            `${bulletsOffset}px`
          );
        }
      }

      if (params.type === "fraction") {
        $el
          .find(classesToSelector(params.currentClass))
          .text(params.formatFractionCurrent(current + 1));
        $el
          .find(classesToSelector(params.totalClass))
          .text(params.formatFractionTotal(total));
      }

      if (params.type === "progressbar") {
        let progressbarDirection;

        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal()
            ? "vertical"
            : "horizontal";
        } else {
          progressbarDirection = swiper.isHorizontal()
            ? "horizontal"
            : "vertical";
        }

        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;

        if (progressbarDirection === "horizontal") {
          scaleX = scale;
        } else {
          scaleY = scale;
        }

        $el
          .find(classesToSelector(params.progressbarFillClass))
          .transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`)
          .transition(swiper.params.speed);
      }

      if (params.type === "custom" && params.renderCustom) {
        $el.html(params.renderCustom(swiper, current + 1, total));
        emit("paginationRender", $el[0]);
      } else {
        emit("paginationUpdate", $el[0]);
      }

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
    }

    function render() {
      // Render Container
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const slidesLength =
        swiper.virtual && swiper.params.virtual.enabled
          ? swiper.virtual.slides.length
          : swiper.slides.length;
      const $el = swiper.pagination.$el;
      let paginationHTML = "";

      if (params.type === "bullets") {
        let numberOfBullets = swiper.params.loop
          ? Math.ceil(
              (slidesLength - swiper.loopedSlides * 2) /
                swiper.params.slidesPerGroup
            )
          : swiper.snapGrid.length;

        if (
          swiper.params.freeMode &&
          swiper.params.freeMode.enabled &&
          !swiper.params.loop &&
          numberOfBullets > slidesLength
        ) {
          numberOfBullets = slidesLength;
        }

        for (let i = 0; i < numberOfBullets; i += 1) {
          if (params.renderBullet) {
            paginationHTML += params.renderBullet.call(
              swiper,
              i,
              params.bulletClass
            );
          } else {
            paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
          }
        }

        $el.html(paginationHTML);
        swiper.pagination.bullets = $el.find(
          classesToSelector(params.bulletClass)
        );
      }

      if (params.type === "fraction") {
        if (params.renderFraction) {
          paginationHTML = params.renderFraction.call(
            swiper,
            params.currentClass,
            params.totalClass
          );
        } else {
          paginationHTML =
            `<span class="${params.currentClass}"></span>` +
            " / " +
            `<span class="${params.totalClass}"></span>`;
        }

        $el.html(paginationHTML);
      }

      if (params.type === "progressbar") {
        if (params.renderProgressbar) {
          paginationHTML = params.renderProgressbar.call(
            swiper,
            params.progressbarFillClass
          );
        } else {
          paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
        }

        $el.html(paginationHTML);
      }

      if (params.type !== "custom") {
        emit("paginationRender", swiper.pagination.$el[0]);
      }
    }

    function init() {
      swiper.params.pagination = createElementIfNotDefined(
        swiper,
        swiper.originalParams.pagination,
        swiper.params.pagination,
        {
          el: "swiper-pagination",
        }
      );
      const params = swiper.params.pagination;
      if (!params.el) return;
      let $el = $(params.el);
      if ($el.length === 0) return;

      if (
        swiper.params.uniqueNavElements &&
        typeof params.el === "string" &&
        $el.length > 1
      ) {
        $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

        if ($el.length > 1) {
          $el = $el.filter((el) => {
            if ($(el).parents(".swiper")[0] !== swiper.el) return false;
            return true;
          });
        }
      }

      if (params.type === "bullets" && params.clickable) {
        $el.addClass(params.clickableClass);
      }

      $el.addClass(params.modifierClass + params.type);
      $el.addClass(
        swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
      );

      if (params.type === "bullets" && params.dynamicBullets) {
        $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;

        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }

      if (params.type === "progressbar" && params.progressbarOpposite) {
        $el.addClass(params.progressbarOppositeClass);
      }

      if (params.clickable) {
        $el.on(
          "click",
          classesToSelector(params.bulletClass),
          function onClick(e) {
            e.preventDefault();
            let index = $(this).index() * swiper.params.slidesPerGroup;
            if (swiper.params.loop) index += swiper.loopedSlides;
            swiper.slideTo(index);
          }
        );
      }

      Object.assign(swiper.pagination, {
        $el,
        el: $el[0],
      });

      if (!swiper.enabled) {
        $el.addClass(params.lockClass);
      }
    }

    function destroy() {
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const $el = swiper.pagination.$el;
      $el.removeClass(params.hiddenClass);
      $el.removeClass(params.modifierClass + params.type);
      $el.removeClass(
        swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
      );
      if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass)
        swiper.pagination.bullets.removeClass(params.bulletActiveClass);

      if (params.clickable) {
        $el.off("click", classesToSelector(params.bulletClass));
      }
    }

    on("init", () => {
      init();
      render();
      update();
    });
    on("activeIndexChange", () => {
      if (swiper.params.loop) {
        update();
      } else if (typeof swiper.snapIndex === "undefined") {
        update();
      }
    });
    on("snapIndexChange", () => {
      if (!swiper.params.loop) {
        update();
      }
    });
    on("slidesLengthChange", () => {
      if (swiper.params.loop) {
        render();
        update();
      }
    });
    on("snapGridLengthChange", () => {
      if (!swiper.params.loop) {
        render();
        update();
      }
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      const { $el } = swiper.pagination;

      if ($el) {
        $el[swiper.enabled ? "removeClass" : "addClass"](
          swiper.params.pagination.lockClass
        );
      }
    });
    on("lock unlock", () => {
      update();
    });
    on("click", (_s, e) => {
      const targetEl = e.target;
      const { $el } = swiper.pagination;

      if (
        swiper.params.pagination.el &&
        swiper.params.pagination.hideOnClick &&
        $el.length > 0 &&
        !$(targetEl).hasClass(swiper.params.pagination.bulletClass)
      ) {
        if (
          swiper.navigation &&
          ((swiper.navigation.nextEl &&
            targetEl === swiper.navigation.nextEl) ||
            (swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl))
        )
          return;
        const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

        if (isHidden === true) {
          emit("paginationShow");
        } else {
          emit("paginationHide");
        }

        $el.toggleClass(swiper.params.pagination.hiddenClass);
      }
    });
    Object.assign(swiper.pagination, {
      render,
      update,
      init,
      destroy,
    });
  }

  function Scrollbar(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const document = getDocument();
    let isTouched = false;
    let timeout = null;
    let dragTimeout = null;
    let dragStartPos;
    let dragSize;
    let trackSize;
    let divider;
    extendParams({
      scrollbar: {
        el: null,
        dragSize: "auto",
        hide: false,
        draggable: false,
        snapOnRelease: true,
        lockClass: "swiper-scrollbar-lock",
        dragClass: "swiper-scrollbar-drag",
      },
    });
    swiper.scrollbar = {
      el: null,
      dragEl: null,
      $el: null,
      $dragEl: null,
    };

    function setTranslate() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const { scrollbar, rtlTranslate: rtl, progress } = swiper;
      const { $dragEl, $el } = scrollbar;
      const params = swiper.params.scrollbar;
      let newSize = dragSize;
      let newPos = (trackSize - dragSize) * progress;

      if (rtl) {
        newPos = -newPos;

        if (newPos > 0) {
          newSize = dragSize - newPos;
          newPos = 0;
        } else if (-newPos + dragSize > trackSize) {
          newSize = trackSize + newPos;
        }
      } else if (newPos < 0) {
        newSize = dragSize + newPos;
        newPos = 0;
      } else if (newPos + dragSize > trackSize) {
        newSize = trackSize - newPos;
      }

      if (swiper.isHorizontal()) {
        $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
        $dragEl[0].style.width = `${newSize}px`;
      } else {
        $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
        $dragEl[0].style.height = `${newSize}px`;
      }

      if (params.hide) {
        clearTimeout(timeout);
        $el[0].style.opacity = 1;
        timeout = setTimeout(() => {
          $el[0].style.opacity = 0;
          $el.transition(400);
        }, 1000);
      }
    }

    function setTransition(duration) {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      swiper.scrollbar.$dragEl.transition(duration);
    }

    function updateSize() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const { scrollbar } = swiper;
      const { $dragEl, $el } = scrollbar;
      $dragEl[0].style.width = "";
      $dragEl[0].style.height = "";
      trackSize = swiper.isHorizontal()
        ? $el[0].offsetWidth
        : $el[0].offsetHeight;
      divider =
        swiper.size /
        (swiper.virtualSize +
          swiper.params.slidesOffsetBefore -
          (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

      if (swiper.params.scrollbar.dragSize === "auto") {
        dragSize = trackSize * divider;
      } else {
        dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
      }

      if (swiper.isHorizontal()) {
        $dragEl[0].style.width = `${dragSize}px`;
      } else {
        $dragEl[0].style.height = `${dragSize}px`;
      }

      if (divider >= 1) {
        $el[0].style.display = "none";
      } else {
        $el[0].style.display = "";
      }

      if (swiper.params.scrollbar.hide) {
        $el[0].style.opacity = 0;
      }

      if (swiper.params.watchOverflow && swiper.enabled) {
        scrollbar.$el[swiper.isLocked ? "addClass" : "removeClass"](
          swiper.params.scrollbar.lockClass
        );
      }
    }

    function getPointerPosition(e) {
      if (swiper.isHorizontal()) {
        return e.type === "touchstart" || e.type === "touchmove"
          ? e.targetTouches[0].clientX
          : e.clientX;
      }

      return e.type === "touchstart" || e.type === "touchmove"
        ? e.targetTouches[0].clientY
        : e.clientY;
    }

    function setDragPosition(e) {
      const { scrollbar, rtlTranslate: rtl } = swiper;
      const { $el } = scrollbar;
      let positionRatio;
      positionRatio =
        (getPointerPosition(e) -
          $el.offset()[swiper.isHorizontal() ? "left" : "top"] -
          (dragStartPos !== null ? dragStartPos : dragSize / 2)) /
        (trackSize - dragSize);
      positionRatio = Math.max(Math.min(positionRatio, 1), 0);

      if (rtl) {
        positionRatio = 1 - positionRatio;
      }

      const position =
        swiper.minTranslate() +
        (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
      swiper.updateProgress(position);
      swiper.setTranslate(position);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    function onDragStart(e) {
      const params = swiper.params.scrollbar;
      const { scrollbar, $wrapperEl } = swiper;
      const { $el, $dragEl } = scrollbar;
      isTouched = true;
      dragStartPos =
        e.target === $dragEl[0] || e.target === $dragEl
          ? getPointerPosition(e) -
            e.target.getBoundingClientRect()[
              swiper.isHorizontal() ? "left" : "top"
            ]
          : null;
      e.preventDefault();
      e.stopPropagation();
      $wrapperEl.transition(100);
      $dragEl.transition(100);
      setDragPosition(e);
      clearTimeout(dragTimeout);
      $el.transition(0);

      if (params.hide) {
        $el.css("opacity", 1);
      }

      if (swiper.params.cssMode) {
        swiper.$wrapperEl.css("scroll-snap-type", "none");
      }

      emit("scrollbarDragStart", e);
    }

    function onDragMove(e) {
      const { scrollbar, $wrapperEl } = swiper;
      const { $el, $dragEl } = scrollbar;
      if (!isTouched) return;
      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
      setDragPosition(e);
      $wrapperEl.transition(0);
      $el.transition(0);
      $dragEl.transition(0);
      emit("scrollbarDragMove", e);
    }

    function onDragEnd(e) {
      const params = swiper.params.scrollbar;
      const { scrollbar, $wrapperEl } = swiper;
      const { $el } = scrollbar;
      if (!isTouched) return;
      isTouched = false;

      if (swiper.params.cssMode) {
        swiper.$wrapperEl.css("scroll-snap-type", "");
        $wrapperEl.transition("");
      }

      if (params.hide) {
        clearTimeout(dragTimeout);
        dragTimeout = nextTick(() => {
          $el.css("opacity", 0);
          $el.transition(400);
        }, 1000);
      }

      emit("scrollbarDragEnd", e);

      if (params.snapOnRelease) {
        swiper.slideToClosest();
      }
    }

    function events(method) {
      const {
        scrollbar,
        touchEventsTouch,
        touchEventsDesktop,
        params,
        support,
      } = swiper;
      const $el = scrollbar.$el;
      const target = $el[0];
      const activeListener =
        support.passiveListener && params.passiveListeners
          ? {
              passive: false,
              capture: false,
            }
          : false;
      const passiveListener =
        support.passiveListener && params.passiveListeners
          ? {
              passive: true,
              capture: false,
            }
          : false;
      if (!target) return;
      const eventMethod =
        method === "on" ? "addEventListener" : "removeEventListener";

      if (!support.touch) {
        target[eventMethod](
          touchEventsDesktop.start,
          onDragStart,
          activeListener
        );
        document[eventMethod](
          touchEventsDesktop.move,
          onDragMove,
          activeListener
        );
        document[eventMethod](
          touchEventsDesktop.end,
          onDragEnd,
          passiveListener
        );
      } else {
        target[eventMethod](
          touchEventsTouch.start,
          onDragStart,
          activeListener
        );
        target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
        target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
      }
    }

    function enableDraggable() {
      if (!swiper.params.scrollbar.el) return;
      events("on");
    }

    function disableDraggable() {
      if (!swiper.params.scrollbar.el) return;
      events("off");
    }

    function init() {
      const { scrollbar, $el: $swiperEl } = swiper;
      swiper.params.scrollbar = createElementIfNotDefined(
        swiper,
        swiper.originalParams.scrollbar,
        swiper.params.scrollbar,
        {
          el: "swiper-scrollbar",
        }
      );
      const params = swiper.params.scrollbar;
      if (!params.el) return;
      let $el = $(params.el);

      if (
        swiper.params.uniqueNavElements &&
        typeof params.el === "string" &&
        $el.length > 1 &&
        $swiperEl.find(params.el).length === 1
      ) {
        $el = $swiperEl.find(params.el);
      }

      let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

      if ($dragEl.length === 0) {
        $dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
        $el.append($dragEl);
      }

      Object.assign(scrollbar, {
        $el,
        el: $el[0],
        $dragEl,
        dragEl: $dragEl[0],
      });

      if (params.draggable) {
        enableDraggable();
      }

      if ($el) {
        $el[swiper.enabled ? "removeClass" : "addClass"](
          swiper.params.scrollbar.lockClass
        );
      }
    }

    function destroy() {
      disableDraggable();
    }

    on("init", () => {
      init();
      updateSize();
      setTranslate();
    });
    on("update resize observerUpdate lock unlock", () => {
      updateSize();
    });
    on("setTranslate", () => {
      setTranslate();
    });
    on("setTransition", (_s, duration) => {
      setTransition(duration);
    });
    on("enable disable", () => {
      const { $el } = swiper.scrollbar;

      if ($el) {
        $el[swiper.enabled ? "removeClass" : "addClass"](
          swiper.params.scrollbar.lockClass
        );
      }
    });
    on("destroy", () => {
      destroy();
    });
    Object.assign(swiper.scrollbar, {
      updateSize,
      setTranslate,
      init,
      destroy,
    });
  }

  function Parallax(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      parallax: {
        enabled: false,
      },
    });

    const setTransform = (el, progress) => {
      const { rtl } = swiper;
      const $el = $(el);
      const rtlFactor = rtl ? -1 : 1;
      const p = $el.attr("data-swiper-parallax") || "0";
      let x = $el.attr("data-swiper-parallax-x");
      let y = $el.attr("data-swiper-parallax-y");
      const scale = $el.attr("data-swiper-parallax-scale");
      const opacity = $el.attr("data-swiper-parallax-opacity");

      if (x || y) {
        x = x || "0";
        y = y || "0";
      } else if (swiper.isHorizontal()) {
        x = p;
        y = "0";
      } else {
        y = p;
        x = "0";
      }

      if (x.indexOf("%") >= 0) {
        x = `${parseInt(x, 10) * progress * rtlFactor}%`;
      } else {
        x = `${x * progress * rtlFactor}px`;
      }

      if (y.indexOf("%") >= 0) {
        y = `${parseInt(y, 10) * progress}%`;
      } else {
        y = `${y * progress}px`;
      }

      if (typeof opacity !== "undefined" && opacity !== null) {
        const currentOpacity =
          opacity - (opacity - 1) * (1 - Math.abs(progress));
        $el[0].style.opacity = currentOpacity;
      }

      if (typeof scale === "undefined" || scale === null) {
        $el.transform(`translate3d(${x}, ${y}, 0px)`);
      } else {
        const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
        $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
      }
    };

    const setTranslate = () => {
      const { $el, slides, progress, snapGrid } = swiper;
      $el
        .children(
          "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
        )
        .each((el) => {
          setTransform(el, progress);
        });
      slides.each((slideEl, slideIndex) => {
        let slideProgress = slideEl.progress;

        if (
          swiper.params.slidesPerGroup > 1 &&
          swiper.params.slidesPerView !== "auto"
        ) {
          slideProgress +=
            Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
        }

        slideProgress = Math.min(Math.max(slideProgress, -1), 1);
        $(slideEl)
          .find(
            "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
          )
          .each((el) => {
            setTransform(el, slideProgress);
          });
      });
    };

    const setTransition = function (duration) {
      if (duration === void 0) {
        duration = swiper.params.speed;
      }

      const { $el } = swiper;
      $el
        .find(
          "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
        )
        .each((parallaxEl) => {
          const $parallaxEl = $(parallaxEl);
          let parallaxDuration =
            parseInt($parallaxEl.attr("data-swiper-parallax-duration"), 10) ||
            duration;
          if (duration === 0) parallaxDuration = 0;
          $parallaxEl.transition(parallaxDuration);
        });
    };

    on("beforeInit", () => {
      if (!swiper.params.parallax.enabled) return;
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    });
    on("init", () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on("setTranslate", () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on("setTransition", (_swiper, duration) => {
      if (!swiper.params.parallax.enabled) return;
      setTransition(duration);
    });
  }

  function Zoom(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    const window = getWindow();
    extendParams({
      zoom: {
        enabled: false,
        maxRatio: 3,
        minRatio: 1,
        toggle: true,
        containerClass: "swiper-zoom-container",
        zoomedSlideClass: "swiper-slide-zoomed",
      },
    });
    swiper.zoom = {
      enabled: false,
    };
    let currentScale = 1;
    let isScaling = false;
    let gesturesEnabled;
    let fakeGestureTouched;
    let fakeGestureMoved;
    const gesture = {
      $slideEl: undefined,
      slideWidth: undefined,
      slideHeight: undefined,
      $imageEl: undefined,
      $imageWrapEl: undefined,
      maxRatio: 3,
    };
    const image = {
      isTouched: undefined,
      isMoved: undefined,
      currentX: undefined,
      currentY: undefined,
      minX: undefined,
      minY: undefined,
      maxX: undefined,
      maxY: undefined,
      width: undefined,
      height: undefined,
      startX: undefined,
      startY: undefined,
      touchesStart: {},
      touchesCurrent: {},
    };
    const velocity = {
      x: undefined,
      y: undefined,
      prevPositionX: undefined,
      prevPositionY: undefined,
      prevTime: undefined,
    };
    let scale = 1;
    Object.defineProperty(swiper.zoom, "scale", {
      get() {
        return scale;
      },

      set(value) {
        if (scale !== value) {
          const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
          const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
          emit("zoomChange", value, imageEl, slideEl);
        }

        scale = value;
      },
    });

    function getDistanceBetweenTouches(e) {
      if (e.targetTouches.length < 2) return 1;
      const x1 = e.targetTouches[0].pageX;
      const y1 = e.targetTouches[0].pageY;
      const x2 = e.targetTouches[1].pageX;
      const y2 = e.targetTouches[1].pageY;
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance;
    } // Events

    function onGestureStart(e) {
      const support = swiper.support;
      const params = swiper.params.zoom;
      fakeGestureTouched = false;
      fakeGestureMoved = false;

      if (!support.gestures) {
        if (
          e.type !== "touchstart" ||
          (e.type === "touchstart" && e.targetTouches.length < 2)
        ) {
          return;
        }

        fakeGestureTouched = true;
        gesture.scaleStart = getDistanceBetweenTouches(e);
      }

      if (!gesture.$slideEl || !gesture.$slideEl.length) {
        gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
        if (gesture.$slideEl.length === 0)
          gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
        gesture.$imageEl = gesture.$slideEl
          .find(`.${params.containerClass}`)
          .eq(0)
          .find("picture, img, svg, canvas, .swiper-zoom-target")
          .eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(
          `.${params.containerClass}`
        );
        gesture.maxRatio =
          gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;

        if (gesture.$imageWrapEl.length === 0) {
          gesture.$imageEl = undefined;
          return;
        }
      }

      if (gesture.$imageEl) {
        gesture.$imageEl.transition(0);
      }

      isScaling = true;
    }

    function onGestureChange(e) {
      const support = swiper.support;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;

      if (!support.gestures) {
        if (
          e.type !== "touchmove" ||
          (e.type === "touchmove" && e.targetTouches.length < 2)
        ) {
          return;
        }

        fakeGestureMoved = true;
        gesture.scaleMove = getDistanceBetweenTouches(e);
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
        if (e.type === "gesturechange") onGestureStart(e);
        return;
      }

      if (support.gestures) {
        zoom.scale = e.scale * currentScale;
      } else {
        zoom.scale = (gesture.scaleMove / gesture.scaleStart) * currentScale;
      }

      if (zoom.scale > gesture.maxRatio) {
        zoom.scale =
          gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
      }

      if (zoom.scale < params.minRatio) {
        zoom.scale =
          params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
      }

      gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    }

    function onGestureEnd(e) {
      const device = swiper.device;
      const support = swiper.support;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;

      if (!support.gestures) {
        if (!fakeGestureTouched || !fakeGestureMoved) {
          return;
        }

        if (
          e.type !== "touchend" ||
          (e.type === "touchend" &&
            e.changedTouches.length < 2 &&
            !device.android)
        ) {
          return;
        }

        fakeGestureTouched = false;
        fakeGestureMoved = false;
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      zoom.scale = Math.max(
        Math.min(zoom.scale, gesture.maxRatio),
        params.minRatio
      );
      gesture.$imageEl
        .transition(swiper.params.speed)
        .transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      currentScale = zoom.scale;
      isScaling = false;
      if (zoom.scale === 1) gesture.$slideEl = undefined;
    }

    function onTouchStart(e) {
      const device = swiper.device;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      if (image.isTouched) return;
      if (device.android && e.cancelable) e.preventDefault();
      image.isTouched = true;
      image.touchesStart.x =
        e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
      image.touchesStart.y =
        e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
    }

    function onTouchMove(e) {
      const zoom = swiper.zoom;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      swiper.allowClick = false;
      if (!image.isTouched || !gesture.$slideEl) return;

      if (!image.isMoved) {
        image.width = gesture.$imageEl[0].offsetWidth;
        image.height = gesture.$imageEl[0].offsetHeight;
        image.startX = getTranslate(gesture.$imageWrapEl[0], "x") || 0;
        image.startY = getTranslate(gesture.$imageWrapEl[0], "y") || 0;
        gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
        gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
        gesture.$imageWrapEl.transition(0);
      } // Define if we need image drag

      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      if (
        scaledWidth < gesture.slideWidth &&
        scaledHeight < gesture.slideHeight
      )
        return;
      image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.touchesCurrent.x =
        e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
      image.touchesCurrent.y =
        e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;

      if (!image.isMoved && !isScaling) {
        if (
          swiper.isHorizontal() &&
          ((Math.floor(image.minX) === Math.floor(image.startX) &&
            image.touchesCurrent.x < image.touchesStart.x) ||
            (Math.floor(image.maxX) === Math.floor(image.startX) &&
              image.touchesCurrent.x > image.touchesStart.x))
        ) {
          image.isTouched = false;
          return;
        }

        if (
          !swiper.isHorizontal() &&
          ((Math.floor(image.minY) === Math.floor(image.startY) &&
            image.touchesCurrent.y < image.touchesStart.y) ||
            (Math.floor(image.maxY) === Math.floor(image.startY) &&
              image.touchesCurrent.y > image.touchesStart.y))
        ) {
          image.isTouched = false;
          return;
        }
      }

      if (e.cancelable) {
        e.preventDefault();
      }

      e.stopPropagation();
      image.isMoved = true;
      image.currentX =
        image.touchesCurrent.x - image.touchesStart.x + image.startX;
      image.currentY =
        image.touchesCurrent.y - image.touchesStart.y + image.startY;

      if (image.currentX < image.minX) {
        image.currentX =
          image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
      }

      if (image.currentX > image.maxX) {
        image.currentX =
          image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
      }

      if (image.currentY < image.minY) {
        image.currentY =
          image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
      }

      if (image.currentY > image.maxY) {
        image.currentY =
          image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
      } // Velocity

      if (!velocity.prevPositionX)
        velocity.prevPositionX = image.touchesCurrent.x;
      if (!velocity.prevPositionY)
        velocity.prevPositionY = image.touchesCurrent.y;
      if (!velocity.prevTime) velocity.prevTime = Date.now();
      velocity.x =
        (image.touchesCurrent.x - velocity.prevPositionX) /
        (Date.now() - velocity.prevTime) /
        2;
      velocity.y =
        (image.touchesCurrent.y - velocity.prevPositionY) /
        (Date.now() - velocity.prevTime) /
        2;
      if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2)
        velocity.x = 0;
      if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2)
        velocity.y = 0;
      velocity.prevPositionX = image.touchesCurrent.x;
      velocity.prevPositionY = image.touchesCurrent.y;
      velocity.prevTime = Date.now();
      gesture.$imageWrapEl.transform(
        `translate3d(${image.currentX}px, ${image.currentY}px,0)`
      );
    }

    function onTouchEnd() {
      const zoom = swiper.zoom;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

      if (!image.isTouched || !image.isMoved) {
        image.isTouched = false;
        image.isMoved = false;
        return;
      }

      image.isTouched = false;
      image.isMoved = false;
      let momentumDurationX = 300;
      let momentumDurationY = 300;
      const momentumDistanceX = velocity.x * momentumDurationX;
      const newPositionX = image.currentX + momentumDistanceX;
      const momentumDistanceY = velocity.y * momentumDurationY;
      const newPositionY = image.currentY + momentumDistanceY; // Fix duration

      if (velocity.x !== 0)
        momentumDurationX = Math.abs(
          (newPositionX - image.currentX) / velocity.x
        );
      if (velocity.y !== 0)
        momentumDurationY = Math.abs(
          (newPositionY - image.currentY) / velocity.y
        );
      const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
      image.currentX = newPositionX;
      image.currentY = newPositionY; // Define if we need image drag

      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.currentX = Math.max(
        Math.min(image.currentX, image.maxX),
        image.minX
      );
      image.currentY = Math.max(
        Math.min(image.currentY, image.maxY),
        image.minY
      );
      gesture.$imageWrapEl
        .transition(momentumDuration)
        .transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
    }

    function onTransitionEnd() {
      const zoom = swiper.zoom;

      if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
        if (gesture.$imageEl) {
          gesture.$imageEl.transform("translate3d(0,0,0) scale(1)");
        }

        if (gesture.$imageWrapEl) {
          gesture.$imageWrapEl.transform("translate3d(0,0,0)");
        }

        zoom.scale = 1;
        currentScale = 1;
        gesture.$slideEl = undefined;
        gesture.$imageEl = undefined;
        gesture.$imageWrapEl = undefined;
      }
    }

    function zoomIn(e) {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;

      if (!gesture.$slideEl) {
        if (e && e.target) {
          gesture.$slideEl = $(e.target).closest(
            `.${swiper.params.slideClass}`
          );
        }

        if (!gesture.$slideEl) {
          if (
            swiper.params.virtual &&
            swiper.params.virtual.enabled &&
            swiper.virtual
          ) {
            gesture.$slideEl = swiper.$wrapperEl.children(
              `.${swiper.params.slideActiveClass}`
            );
          } else {
            gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          }
        }

        gesture.$imageEl = gesture.$slideEl
          .find(`.${params.containerClass}`)
          .eq(0)
          .find("picture, img, svg, canvas, .swiper-zoom-target")
          .eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(
          `.${params.containerClass}`
        );
      }

      if (
        !gesture.$imageEl ||
        gesture.$imageEl.length === 0 ||
        !gesture.$imageWrapEl ||
        gesture.$imageWrapEl.length === 0
      )
        return;

      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.touchAction = "none";
      }

      gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
      let touchX;
      let touchY;
      let offsetX;
      let offsetY;
      let diffX;
      let diffY;
      let translateX;
      let translateY;
      let imageWidth;
      let imageHeight;
      let scaledWidth;
      let scaledHeight;
      let translateMinX;
      let translateMinY;
      let translateMaxX;
      let translateMaxY;
      let slideWidth;
      let slideHeight;

      if (typeof image.touchesStart.x === "undefined" && e) {
        touchX = e.type === "touchend" ? e.changedTouches[0].pageX : e.pageX;
        touchY = e.type === "touchend" ? e.changedTouches[0].pageY : e.pageY;
      } else {
        touchX = image.touchesStart.x;
        touchY = image.touchesStart.y;
      }

      zoom.scale =
        gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;
      currentScale =
        gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;

      if (e) {
        slideWidth = gesture.$slideEl[0].offsetWidth;
        slideHeight = gesture.$slideEl[0].offsetHeight;
        offsetX = gesture.$slideEl.offset().left + window.scrollX;
        offsetY = gesture.$slideEl.offset().top + window.scrollY;
        diffX = offsetX + slideWidth / 2 - touchX;
        diffY = offsetY + slideHeight / 2 - touchY;
        imageWidth = gesture.$imageEl[0].offsetWidth;
        imageHeight = gesture.$imageEl[0].offsetHeight;
        scaledWidth = imageWidth * zoom.scale;
        scaledHeight = imageHeight * zoom.scale;
        translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
        translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
        translateMaxX = -translateMinX;
        translateMaxY = -translateMinY;
        translateX = diffX * zoom.scale;
        translateY = diffY * zoom.scale;

        if (translateX < translateMinX) {
          translateX = translateMinX;
        }

        if (translateX > translateMaxX) {
          translateX = translateMaxX;
        }

        if (translateY < translateMinY) {
          translateY = translateMinY;
        }

        if (translateY > translateMaxY) {
          translateY = translateMaxY;
        }
      } else {
        translateX = 0;
        translateY = 0;
      }

      gesture.$imageWrapEl
        .transition(300)
        .transform(`translate3d(${translateX}px, ${translateY}px,0)`);
      gesture.$imageEl
        .transition(300)
        .transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    }

    function zoomOut() {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;

      if (!gesture.$slideEl) {
        if (
          swiper.params.virtual &&
          swiper.params.virtual.enabled &&
          swiper.virtual
        ) {
          gesture.$slideEl = swiper.$wrapperEl.children(
            `.${swiper.params.slideActiveClass}`
          );
        } else {
          gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
        }

        gesture.$imageEl = gesture.$slideEl
          .find(`.${params.containerClass}`)
          .eq(0)
          .find("picture, img, svg, canvas, .swiper-zoom-target")
          .eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(
          `.${params.containerClass}`
        );
      }

      if (
        !gesture.$imageEl ||
        gesture.$imageEl.length === 0 ||
        !gesture.$imageWrapEl ||
        gesture.$imageWrapEl.length === 0
      )
        return;

      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.style.touchAction = "";
      }

      zoom.scale = 1;
      currentScale = 1;
      gesture.$imageWrapEl.transition(300).transform("translate3d(0,0,0)");
      gesture.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)");
      gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
      gesture.$slideEl = undefined;
    } // Toggle Zoom

    function zoomToggle(e) {
      const zoom = swiper.zoom;

      if (zoom.scale && zoom.scale !== 1) {
        // Zoom Out
        zoomOut();
      } else {
        // Zoom In
        zoomIn(e);
      }
    }

    function getListeners() {
      const support = swiper.support;
      const passiveListener =
        swiper.touchEvents.start === "touchstart" &&
        support.passiveListener &&
        swiper.params.passiveListeners
          ? {
              passive: true,
              capture: false,
            }
          : false;
      const activeListenerWithCapture = support.passiveListener
        ? {
            passive: false,
            capture: true,
          }
        : true;
      return {
        passiveListener,
        activeListenerWithCapture,
      };
    }

    function getSlideSelector() {
      return `.${swiper.params.slideClass}`;
    }

    function toggleGestures(method) {
      const { passiveListener } = getListeners();
      const slideSelector = getSlideSelector();
      swiper.$wrapperEl[method](
        "gesturestart",
        slideSelector,
        onGestureStart,
        passiveListener
      );
      swiper.$wrapperEl[method](
        "gesturechange",
        slideSelector,
        onGestureChange,
        passiveListener
      );
      swiper.$wrapperEl[method](
        "gestureend",
        slideSelector,
        onGestureEnd,
        passiveListener
      );
    }

    function enableGestures() {
      if (gesturesEnabled) return;
      gesturesEnabled = true;
      toggleGestures("on");
    }

    function disableGestures() {
      if (!gesturesEnabled) return;
      gesturesEnabled = false;
      toggleGestures("off");
    } // Attach/Detach Events

    function enable() {
      const zoom = swiper.zoom;
      if (zoom.enabled) return;
      zoom.enabled = true;
      const support = swiper.support;
      const { passiveListener, activeListenerWithCapture } = getListeners();
      const slideSelector = getSlideSelector(); // Scale image

      if (support.gestures) {
        swiper.$wrapperEl.on(
          swiper.touchEvents.start,
          enableGestures,
          passiveListener
        );
        swiper.$wrapperEl.on(
          swiper.touchEvents.end,
          disableGestures,
          passiveListener
        );
      } else if (swiper.touchEvents.start === "touchstart") {
        swiper.$wrapperEl.on(
          swiper.touchEvents.start,
          slideSelector,
          onGestureStart,
          passiveListener
        );
        swiper.$wrapperEl.on(
          swiper.touchEvents.move,
          slideSelector,
          onGestureChange,
          activeListenerWithCapture
        );
        swiper.$wrapperEl.on(
          swiper.touchEvents.end,
          slideSelector,
          onGestureEnd,
          passiveListener
        );

        if (swiper.touchEvents.cancel) {
          swiper.$wrapperEl.on(
            swiper.touchEvents.cancel,
            slideSelector,
            onGestureEnd,
            passiveListener
          );
        }
      } // Move image

      swiper.$wrapperEl.on(
        swiper.touchEvents.move,
        `.${swiper.params.zoom.containerClass}`,
        onTouchMove,
        activeListenerWithCapture
      );
    }

    function disable() {
      const zoom = swiper.zoom;
      if (!zoom.enabled) return;
      const support = swiper.support;
      zoom.enabled = false;
      const { passiveListener, activeListenerWithCapture } = getListeners();
      const slideSelector = getSlideSelector(); // Scale image

      if (support.gestures) {
        swiper.$wrapperEl.off(
          swiper.touchEvents.start,
          enableGestures,
          passiveListener
        );
        swiper.$wrapperEl.off(
          swiper.touchEvents.end,
          disableGestures,
          passiveListener
        );
      } else if (swiper.touchEvents.start === "touchstart") {
        swiper.$wrapperEl.off(
          swiper.touchEvents.start,
          slideSelector,
          onGestureStart,
          passiveListener
        );
        swiper.$wrapperEl.off(
          swiper.touchEvents.move,
          slideSelector,
          onGestureChange,
          activeListenerWithCapture
        );
        swiper.$wrapperEl.off(
          swiper.touchEvents.end,
          slideSelector,
          onGestureEnd,
          passiveListener
        );

        if (swiper.touchEvents.cancel) {
          swiper.$wrapperEl.off(
            swiper.touchEvents.cancel,
            slideSelector,
            onGestureEnd,
            passiveListener
          );
        }
      } // Move image

      swiper.$wrapperEl.off(
        swiper.touchEvents.move,
        `.${swiper.params.zoom.containerClass}`,
        onTouchMove,
        activeListenerWithCapture
      );
    }

    on("init", () => {
      if (swiper.params.zoom.enabled) {
        enable();
      }
    });
    on("destroy", () => {
      disable();
    });
    on("touchStart", (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchStart(e);
    });
    on("touchEnd", (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchEnd();
    });
    on("doubleTap", (_s, e) => {
      if (
        !swiper.animating &&
        swiper.params.zoom.enabled &&
        swiper.zoom.enabled &&
        swiper.params.zoom.toggle
      ) {
        zoomToggle(e);
      }
    });
    on("transitionEnd", () => {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
        onTransitionEnd();
      }
    });
    on("slideChange", () => {
      if (
        swiper.zoom.enabled &&
        swiper.params.zoom.enabled &&
        swiper.params.cssMode
      ) {
        onTransitionEnd();
      }
    });
    Object.assign(swiper.zoom, {
      enable,
      disable,
      in: zoomIn,
      out: zoomOut,
      toggle: zoomToggle,
    });
  }

  function Lazy(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    extendParams({
      lazy: {
        checkInView: false,
        enabled: false,
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,
        scrollingElement: "",
        elementClass: "swiper-lazy",
        loadingClass: "swiper-lazy-loading",
        loadedClass: "swiper-lazy-loaded",
        preloaderClass: "swiper-lazy-preloader",
      },
    });
    swiper.lazy = {};
    let scrollHandlerAttached = false;
    let initialImageLoaded = false;

    function loadInSlide(index, loadInDuplicate) {
      if (loadInDuplicate === void 0) {
        loadInDuplicate = true;
      }

      const params = swiper.params.lazy;
      if (typeof index === "undefined") return;
      if (swiper.slides.length === 0) return;
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      const $slideEl = isVirtual
        ? swiper.$wrapperEl.children(
            `.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`
          )
        : swiper.slides.eq(index);
      const $images = $slideEl.find(
        `.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`
      );

      if (
        $slideEl.hasClass(params.elementClass) &&
        !$slideEl.hasClass(params.loadedClass) &&
        !$slideEl.hasClass(params.loadingClass)
      ) {
        $images.push($slideEl[0]);
      }

      if ($images.length === 0) return;
      $images.each((imageEl) => {
        const $imageEl = $(imageEl);
        $imageEl.addClass(params.loadingClass);
        const background = $imageEl.attr("data-background");
        const src = $imageEl.attr("data-src");
        const srcset = $imageEl.attr("data-srcset");
        const sizes = $imageEl.attr("data-sizes");
        const $pictureEl = $imageEl.parent("picture");
        swiper.loadImage(
          $imageEl[0],
          src || background,
          srcset,
          sizes,
          false,
          () => {
            if (
              typeof swiper === "undefined" ||
              swiper === null ||
              !swiper ||
              (swiper && !swiper.params) ||
              swiper.destroyed
            )
              return;

            if (background) {
              $imageEl.css("background-image", `url("${background}")`);
              $imageEl.removeAttr("data-background");
            } else {
              if (srcset) {
                $imageEl.attr("srcset", srcset);
                $imageEl.removeAttr("data-srcset");
              }

              if (sizes) {
                $imageEl.attr("sizes", sizes);
                $imageEl.removeAttr("data-sizes");
              }

              if ($pictureEl.length) {
                $pictureEl.children("source").each((sourceEl) => {
                  const $source = $(sourceEl);

                  if ($source.attr("data-srcset")) {
                    $source.attr("srcset", $source.attr("data-srcset"));
                    $source.removeAttr("data-srcset");
                  }
                });
              }

              if (src) {
                $imageEl.attr("src", src);
                $imageEl.removeAttr("data-src");
              }
            }

            $imageEl
              .addClass(params.loadedClass)
              .removeClass(params.loadingClass);
            $slideEl.find(`.${params.preloaderClass}`).remove();

            if (swiper.params.loop && loadInDuplicate) {
              const slideOriginalIndex = $slideEl.attr(
                "data-swiper-slide-index"
              );

              if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
                const originalSlide = swiper.$wrapperEl.children(
                  `[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`
                );
                loadInSlide(originalSlide.index(), false);
              } else {
                const duplicatedSlide = swiper.$wrapperEl.children(
                  `.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`
                );
                loadInSlide(duplicatedSlide.index(), false);
              }
            }

            emit("lazyImageReady", $slideEl[0], $imageEl[0]);

            if (swiper.params.autoHeight) {
              swiper.updateAutoHeight();
            }
          }
        );
        emit("lazyImageLoad", $slideEl[0], $imageEl[0]);
      });
    }

    function load() {
      const { $wrapperEl, params: swiperParams, slides, activeIndex } = swiper;
      const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
      const params = swiperParams.lazy;
      let slidesPerView = swiperParams.slidesPerView;

      if (slidesPerView === "auto") {
        slidesPerView = 0;
      }

      function slideExist(index) {
        if (isVirtual) {
          if (
            $wrapperEl.children(
              `.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`
            ).length
          ) {
            return true;
          }
        } else if (slides[index]) return true;

        return false;
      }

      function slideIndex(slideEl) {
        if (isVirtual) {
          return $(slideEl).attr("data-swiper-slide-index");
        }

        return $(slideEl).index();
      }

      if (!initialImageLoaded) initialImageLoaded = true;

      if (swiper.params.watchSlidesProgress) {
        $wrapperEl
          .children(`.${swiperParams.slideVisibleClass}`)
          .each((slideEl) => {
            const index = isVirtual
              ? $(slideEl).attr("data-swiper-slide-index")
              : $(slideEl).index();
            loadInSlide(index);
          });
      } else if (slidesPerView > 1) {
        for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
          if (slideExist(i)) loadInSlide(i);
        }
      } else {
        loadInSlide(activeIndex);
      }

      if (params.loadPrevNext) {
        if (
          slidesPerView > 1 ||
          (params.loadPrevNextAmount && params.loadPrevNextAmount > 1)
        ) {
          const amount = params.loadPrevNextAmount;
          const spv = slidesPerView;
          const maxIndex = Math.min(
            activeIndex + spv + Math.max(amount, spv),
            slides.length
          );
          const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

          for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
            if (slideExist(i)) loadInSlide(i);
          } // Prev Slides

          for (let i = minIndex; i < activeIndex; i += 1) {
            if (slideExist(i)) loadInSlide(i);
          }
        } else {
          const nextSlide = $wrapperEl.children(
            `.${swiperParams.slideNextClass}`
          );
          if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
          const prevSlide = $wrapperEl.children(
            `.${swiperParams.slidePrevClass}`
          );
          if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
        }
      }
    }

    function checkInViewOnLoad() {
      const window = getWindow();
      if (!swiper || swiper.destroyed) return;
      const $scrollElement = swiper.params.lazy.scrollingElement
        ? $(swiper.params.lazy.scrollingElement)
        : $(window);
      const isWindow = $scrollElement[0] === window;
      const scrollElementWidth = isWindow
        ? window.innerWidth
        : $scrollElement[0].offsetWidth;
      const scrollElementHeight = isWindow
        ? window.innerHeight
        : $scrollElement[0].offsetHeight;
      const swiperOffset = swiper.$el.offset();
      const { rtlTranslate: rtl } = swiper;
      let inView = false;
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      const swiperCoord = [
        [swiperOffset.left, swiperOffset.top],
        [swiperOffset.left + swiper.width, swiperOffset.top],
        [swiperOffset.left, swiperOffset.top + swiper.height],
        [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height],
      ];

      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];

        if (
          point[0] >= 0 &&
          point[0] <= scrollElementWidth &&
          point[1] >= 0 &&
          point[1] <= scrollElementHeight
        ) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

          inView = true;
        }
      }

      const passiveListener =
        swiper.touchEvents.start === "touchstart" &&
        swiper.support.passiveListener &&
        swiper.params.passiveListeners
          ? {
              passive: true,
              capture: false,
            }
          : false;

      if (inView) {
        load();
        $scrollElement.off("scroll", checkInViewOnLoad, passiveListener);
      } else if (!scrollHandlerAttached) {
        scrollHandlerAttached = true;
        $scrollElement.on("scroll", checkInViewOnLoad, passiveListener);
      }
    }

    on("beforeInit", () => {
      if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
        swiper.params.preloadImages = false;
      }
    });
    on("init", () => {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on("scroll", () => {
      if (
        swiper.params.freeMode &&
        swiper.params.freeMode.enabled &&
        !swiper.params.freeMode.sticky
      ) {
        load();
      }
    });
    on("scrollbarDragMove resize _freeModeNoMomentumRelease", () => {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on("transitionStart", () => {
      if (swiper.params.lazy.enabled) {
        if (
          swiper.params.lazy.loadOnTransitionStart ||
          (!swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded)
        ) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      }
    });
    on("transitionEnd", () => {
      if (
        swiper.params.lazy.enabled &&
        !swiper.params.lazy.loadOnTransitionStart
      ) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on("slideChange", () => {
      const {
        lazy,
        cssMode,
        watchSlidesProgress,
        touchReleaseOnEdges,
        resistanceRatio,
      } = swiper.params;

      if (
        lazy.enabled &&
        (cssMode ||
          (watchSlidesProgress &&
            (touchReleaseOnEdges || resistanceRatio === 0)))
      ) {
        load();
      }
    });
    Object.assign(swiper.lazy, {
      load,
      loadInSlide,
    });
  }

  /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
  function Controller(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      controller: {
        control: undefined,
        inverse: false,
        by: "slide", // or 'container'
      },
    });
    swiper.controller = {
      control: undefined,
    };

    function LinearSpline(x, y) {
      const binarySearch = (function search() {
        let maxIndex;
        let minIndex;
        let guess;
        return (array, val) => {
          minIndex = -1;
          maxIndex = array.length;

          while (maxIndex - minIndex > 1) {
            guess = (maxIndex + minIndex) >> 1;

            if (array[guess] <= val) {
              minIndex = guess;
            } else {
              maxIndex = guess;
            }
          }

          return maxIndex;
        };
      })();

      this.x = x;
      this.y = y;
      this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
      // (x1,y1) is the known point before given value,
      // (x3,y3) is the known point after given value.

      let i1;
      let i3;

      this.interpolate = function interpolate(x2) {
        if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

        i3 = binarySearch(this.x, x2);
        i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
        // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

        return (
          ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) /
            (this.x[i3] - this.x[i1]) +
          this.y[i1]
        );
      };

      return this;
    } // xxx: for now i will just save one spline function to to

    function getInterpolateFunction(c) {
      if (!swiper.controller.spline) {
        swiper.controller.spline = swiper.params.loop
          ? new LinearSpline(swiper.slidesGrid, c.slidesGrid)
          : new LinearSpline(swiper.snapGrid, c.snapGrid);
      }
    }

    function setTranslate(_t, byController) {
      const controlled = swiper.controller.control;
      let multiplier;
      let controlledTranslate;
      const Swiper = swiper.constructor;

      function setControlledTranslate(c) {
        // this will create an Interpolate function based on the snapGrids
        // x is the Grid of the scrolled scroller and y will be the controlled scroller
        // it makes sense to create this only once and recall it for the interpolation
        // the function does a lot of value caching for performance
        const translate = swiper.rtlTranslate
          ? -swiper.translate
          : swiper.translate;

        if (swiper.params.controller.by === "slide") {
          getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
          // but it did not work out

          controlledTranslate = -swiper.controller.spline.interpolate(
            -translate
          );
        }

        if (
          !controlledTranslate ||
          swiper.params.controller.by === "container"
        ) {
          multiplier =
            (c.maxTranslate() - c.minTranslate()) /
            (swiper.maxTranslate() - swiper.minTranslate());
          controlledTranslate =
            (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
        }

        if (swiper.params.controller.inverse) {
          controlledTranslate = c.maxTranslate() - controlledTranslate;
        }

        c.updateProgress(controlledTranslate);
        c.setTranslate(controlledTranslate, swiper);
        c.updateActiveIndex();
        c.updateSlidesClasses();
      }

      if (Array.isArray(controlled)) {
        for (let i = 0; i < controlled.length; i += 1) {
          if (
            controlled[i] !== byController &&
            controlled[i] instanceof Swiper
          ) {
            setControlledTranslate(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTranslate(controlled);
      }
    }

    function setTransition(duration, byController) {
      const Swiper = swiper.constructor;
      const controlled = swiper.controller.control;
      let i;

      function setControlledTransition(c) {
        c.setTransition(duration, swiper);

        if (duration !== 0) {
          c.transitionStart();

          if (c.params.autoHeight) {
            nextTick(() => {
              c.updateAutoHeight();
            });
          }

          c.$wrapperEl.transitionEnd(() => {
            if (!controlled) return;

            if (c.params.loop && swiper.params.controller.by === "slide") {
              c.loopFix();
            }

            c.transitionEnd();
          });
        }
      }

      if (Array.isArray(controlled)) {
        for (i = 0; i < controlled.length; i += 1) {
          if (
            controlled[i] !== byController &&
            controlled[i] instanceof Swiper
          ) {
            setControlledTransition(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTransition(controlled);
      }
    }

    function removeSpline() {
      if (!swiper.controller.control) return;

      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    }

    on("beforeInit", () => {
      swiper.controller.control = swiper.params.controller.control;
    });
    on("update", () => {
      removeSpline();
    });
    on("resize", () => {
      removeSpline();
    });
    on("observerUpdate", () => {
      removeSpline();
    });
    on("setTranslate", (_s, translate, byController) => {
      if (!swiper.controller.control) return;
      swiper.controller.setTranslate(translate, byController);
    });
    on("setTransition", (_s, duration, byController) => {
      if (!swiper.controller.control) return;
      swiper.controller.setTransition(duration, byController);
    });
    Object.assign(swiper.controller, {
      setTranslate,
      setTransition,
    });
  }

  function A11y(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      a11y: {
        enabled: true,
        notificationClass: "swiper-notification",
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}",
        slideLabelMessage: "{{index}} / {{slidesLength}}",
        containerMessage: null,
        containerRoleDescriptionMessage: null,
        itemRoleDescriptionMessage: null,
        slideRole: "group",
      },
    });
    let liveRegion = null;

    function notify(message) {
      const notification = liveRegion;
      if (notification.length === 0) return;
      notification.html("");
      notification.html(message);
    }

    function getRandomNumber(size) {
      if (size === void 0) {
        size = 16;
      }

      const randomChar = () => Math.round(16 * Math.random()).toString(16);

      return "x".repeat(size).replace(/x/g, randomChar);
    }

    function makeElFocusable($el) {
      $el.attr("tabIndex", "0");
    }

    function makeElNotFocusable($el) {
      $el.attr("tabIndex", "-1");
    }

    function addElRole($el, role) {
      $el.attr("role", role);
    }

    function addElRoleDescription($el, description) {
      $el.attr("aria-roledescription", description);
    }

    function addElControls($el, controls) {
      $el.attr("aria-controls", controls);
    }

    function addElLabel($el, label) {
      $el.attr("aria-label", label);
    }

    function addElId($el, id) {
      $el.attr("id", id);
    }

    function addElLive($el, live) {
      $el.attr("aria-live", live);
    }

    function disableEl($el) {
      $el.attr("aria-disabled", true);
    }

    function enableEl($el) {
      $el.attr("aria-disabled", false);
    }

    function onEnterOrSpaceKey(e) {
      if (e.keyCode !== 13 && e.keyCode !== 32) return;
      const params = swiper.params.a11y;
      const $targetEl = $(e.target);

      if (
        swiper.navigation &&
        swiper.navigation.$nextEl &&
        $targetEl.is(swiper.navigation.$nextEl)
      ) {
        if (!(swiper.isEnd && !swiper.params.loop)) {
          swiper.slideNext();
        }

        if (swiper.isEnd) {
          notify(params.lastSlideMessage);
        } else {
          notify(params.nextSlideMessage);
        }
      }

      if (
        swiper.navigation &&
        swiper.navigation.$prevEl &&
        $targetEl.is(swiper.navigation.$prevEl)
      ) {
        if (!(swiper.isBeginning && !swiper.params.loop)) {
          swiper.slidePrev();
        }

        if (swiper.isBeginning) {
          notify(params.firstSlideMessage);
        } else {
          notify(params.prevSlideMessage);
        }
      }

      if (
        swiper.pagination &&
        $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))
      ) {
        $targetEl[0].click();
      }
    }

    function updateNavigation() {
      if (swiper.params.loop || swiper.params.rewind || !swiper.navigation)
        return;
      const { $nextEl, $prevEl } = swiper.navigation;

      if ($prevEl && $prevEl.length > 0) {
        if (swiper.isBeginning) {
          disableEl($prevEl);
          makeElNotFocusable($prevEl);
        } else {
          enableEl($prevEl);
          makeElFocusable($prevEl);
        }
      }

      if ($nextEl && $nextEl.length > 0) {
        if (swiper.isEnd) {
          disableEl($nextEl);
          makeElNotFocusable($nextEl);
        } else {
          enableEl($nextEl);
          makeElFocusable($nextEl);
        }
      }
    }

    function hasPagination() {
      return (
        swiper.pagination &&
        swiper.pagination.bullets &&
        swiper.pagination.bullets.length
      );
    }

    function hasClickablePagination() {
      return hasPagination() && swiper.params.pagination.clickable;
    }

    function updatePagination() {
      const params = swiper.params.a11y;
      if (!hasPagination()) return;
      swiper.pagination.bullets.each((bulletEl) => {
        const $bulletEl = $(bulletEl);

        if (swiper.params.pagination.clickable) {
          makeElFocusable($bulletEl);

          if (!swiper.params.pagination.renderBullet) {
            addElRole($bulletEl, "button");
            addElLabel(
              $bulletEl,
              params.paginationBulletMessage.replace(
                /\{\{index\}\}/,
                $bulletEl.index() + 1
              )
            );
          }
        }

        if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
          $bulletEl.attr("aria-current", "true");
        } else {
          $bulletEl.removeAttr("aria-current");
        }
      });
    }

    const initNavEl = ($el, wrapperId, message) => {
      makeElFocusable($el);

      if ($el[0].tagName !== "BUTTON") {
        addElRole($el, "button");
        $el.on("keydown", onEnterOrSpaceKey);
      }

      addElLabel($el, message);
      addElControls($el, wrapperId);
    };

    const handleFocus = (e) => {
      const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
      if (!slideEl || !swiper.slides.includes(slideEl)) return;
      const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
      const isVisible =
        swiper.params.watchSlidesProgress &&
        swiper.visibleSlides &&
        swiper.visibleSlides.includes(slideEl);
      if (isActive || isVisible) return;
      swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
    };

    function init() {
      const params = swiper.params.a11y;
      swiper.$el.append(liveRegion); // Container

      const $containerEl = swiper.$el;

      if (params.containerRoleDescriptionMessage) {
        addElRoleDescription(
          $containerEl,
          params.containerRoleDescriptionMessage
        );
      }

      if (params.containerMessage) {
        addElLabel($containerEl, params.containerMessage);
      } // Wrapper

      const $wrapperEl = swiper.$wrapperEl;
      const wrapperId =
        $wrapperEl.attr("id") || `swiper-wrapper-${getRandomNumber(16)}`;
      const live =
        swiper.params.autoplay && swiper.params.autoplay.enabled
          ? "off"
          : "polite";
      addElId($wrapperEl, wrapperId);
      addElLive($wrapperEl, live); // Slide

      if (params.itemRoleDescriptionMessage) {
        addElRoleDescription(
          $(swiper.slides),
          params.itemRoleDescriptionMessage
        );
      }

      addElRole($(swiper.slides), params.slideRole);
      const slidesLength = swiper.params.loop
        ? swiper.slides.filter(
            (el) => !el.classList.contains(swiper.params.slideDuplicateClass)
          ).length
        : swiper.slides.length;
      swiper.slides.each((slideEl, index) => {
        const $slideEl = $(slideEl);
        const slideIndex = swiper.params.loop
          ? parseInt($slideEl.attr("data-swiper-slide-index"), 10)
          : index;
        const ariaLabelMessage = params.slideLabelMessage
          .replace(/\{\{index\}\}/, slideIndex + 1)
          .replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel($slideEl, ariaLabelMessage);
      }); // Navigation

      let $nextEl;
      let $prevEl;

      if (swiper.navigation && swiper.navigation.$nextEl) {
        $nextEl = swiper.navigation.$nextEl;
      }

      if (swiper.navigation && swiper.navigation.$prevEl) {
        $prevEl = swiper.navigation.$prevEl;
      }

      if ($nextEl && $nextEl.length) {
        initNavEl($nextEl, wrapperId, params.nextSlideMessage);
      }

      if ($prevEl && $prevEl.length) {
        initNavEl($prevEl, wrapperId, params.prevSlideMessage);
      } // Pagination

      if (hasClickablePagination()) {
        swiper.pagination.$el.on(
          "keydown",
          classesToSelector(swiper.params.pagination.bulletClass),
          onEnterOrSpaceKey
        );
      } // Tab focus

      swiper.$el.on("focus", handleFocus, true);
    }

    function destroy() {
      if (liveRegion && liveRegion.length > 0) liveRegion.remove();
      let $nextEl;
      let $prevEl;

      if (swiper.navigation && swiper.navigation.$nextEl) {
        $nextEl = swiper.navigation.$nextEl;
      }

      if (swiper.navigation && swiper.navigation.$prevEl) {
        $prevEl = swiper.navigation.$prevEl;
      }

      if ($nextEl) {
        $nextEl.off("keydown", onEnterOrSpaceKey);
      }

      if ($prevEl) {
        $prevEl.off("keydown", onEnterOrSpaceKey);
      } // Pagination

      if (hasClickablePagination()) {
        swiper.pagination.$el.off(
          "keydown",
          classesToSelector(swiper.params.pagination.bulletClass),
          onEnterOrSpaceKey
        );
      } // Tab focus

      swiper.$el.off("focus", handleFocus, true);
    }

    on("beforeInit", () => {
      liveRegion = $(
        `<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`
      );
    });
    on("afterInit", () => {
      if (!swiper.params.a11y.enabled) return;
      init();
    });
    on("fromEdge toEdge afterInit lock unlock", () => {
      if (!swiper.params.a11y.enabled) return;
      updateNavigation();
    });
    on("paginationUpdate", () => {
      if (!swiper.params.a11y.enabled) return;
      updatePagination();
    });
    on("destroy", () => {
      if (!swiper.params.a11y.enabled) return;
      destroy();
    });
  }

  function History(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      history: {
        enabled: false,
        root: "",
        replaceState: false,
        key: "slides",
      },
    });
    let initialized = false;
    let paths = {};

    const slugify = (text) => {
      return text
        .toString()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    };

    const getPathValues = (urlOverride) => {
      const window = getWindow();
      let location;

      if (urlOverride) {
        location = new URL(urlOverride);
      } else {
        location = window.location;
      }

      const pathArray = location.pathname
        .slice(1)
        .split("/")
        .filter((part) => part !== "");
      const total = pathArray.length;
      const key = pathArray[total - 2];
      const value = pathArray[total - 1];
      return {
        key,
        value,
      };
    };

    const setHistory = (key, index) => {
      const window = getWindow();
      if (!initialized || !swiper.params.history.enabled) return;
      let location;

      if (swiper.params.url) {
        location = new URL(swiper.params.url);
      } else {
        location = window.location;
      }

      const slide = swiper.slides.eq(index);
      let value = slugify(slide.attr("data-history"));

      if (swiper.params.history.root.length > 0) {
        let root = swiper.params.history.root;
        if (root[root.length - 1] === "/")
          root = root.slice(0, root.length - 1);
        value = `${root}/${key}/${value}`;
      } else if (!location.pathname.includes(key)) {
        value = `${key}/${value}`;
      }

      const currentState = window.history.state;

      if (currentState && currentState.value === value) {
        return;
      }

      if (swiper.params.history.replaceState) {
        window.history.replaceState(
          {
            value,
          },
          null,
          value
        );
      } else {
        window.history.pushState(
          {
            value,
          },
          null,
          value
        );
      }
    };

    const scrollToSlide = (speed, value, runCallbacks) => {
      if (value) {
        for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
          const slide = swiper.slides.eq(i);
          const slideHistory = slugify(slide.attr("data-history"));

          if (
            slideHistory === value &&
            !slide.hasClass(swiper.params.slideDuplicateClass)
          ) {
            const index = slide.index();
            swiper.slideTo(index, speed, runCallbacks);
          }
        }
      } else {
        swiper.slideTo(0, speed, runCallbacks);
      }
    };

    const setHistoryPopState = () => {
      paths = getPathValues(swiper.params.url);
      scrollToSlide(swiper.params.speed, swiper.paths.value, false);
    };

    const init = () => {
      const window = getWindow();
      if (!swiper.params.history) return;

      if (!window.history || !window.history.pushState) {
        swiper.params.history.enabled = false;
        swiper.params.hashNavigation.enabled = true;
        return;
      }

      initialized = true;
      paths = getPathValues(swiper.params.url);
      if (!paths.key && !paths.value) return;
      scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

      if (!swiper.params.history.replaceState) {
        window.addEventListener("popstate", setHistoryPopState);
      }
    };

    const destroy = () => {
      const window = getWindow();

      if (!swiper.params.history.replaceState) {
        window.removeEventListener("popstate", setHistoryPopState);
      }
    };

    on("init", () => {
      if (swiper.params.history.enabled) {
        init();
      }
    });
    on("destroy", () => {
      if (swiper.params.history.enabled) {
        destroy();
      }
    });
    on("transitionEnd _freeModeNoMomentumRelease", () => {
      if (initialized) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
    on("slideChange", () => {
      if (initialized && swiper.params.cssMode) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
  }

  function HashNavigation(_ref) {
    let { swiper, extendParams, emit, on } = _ref;
    let initialized = false;
    const document = getDocument();
    const window = getWindow();
    extendParams({
      hashNavigation: {
        enabled: false,
        replaceState: false,
        watchState: false,
      },
    });

    const onHashChange = () => {
      emit("hashChange");
      const newHash = document.location.hash.replace("#", "");
      const activeSlideHash = swiper.slides
        .eq(swiper.activeIndex)
        .attr("data-hash");

      if (newHash !== activeSlideHash) {
        const newIndex = swiper.$wrapperEl
          .children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`)
          .index();
        if (typeof newIndex === "undefined") return;
        swiper.slideTo(newIndex);
      }
    };

    const setHash = () => {
      if (!initialized || !swiper.params.hashNavigation.enabled) return;

      if (
        swiper.params.hashNavigation.replaceState &&
        window.history &&
        window.history.replaceState
      ) {
        window.history.replaceState(
          null,
          null,
          `#${swiper.slides.eq(swiper.activeIndex).attr("data-hash")}` || ""
        );
        emit("hashSet");
      } else {
        const slide = swiper.slides.eq(swiper.activeIndex);
        const hash = slide.attr("data-hash") || slide.attr("data-history");
        document.location.hash = hash || "";
        emit("hashSet");
      }
    };

    const init = () => {
      if (
        !swiper.params.hashNavigation.enabled ||
        (swiper.params.history && swiper.params.history.enabled)
      )
        return;
      initialized = true;
      const hash = document.location.hash.replace("#", "");

      if (hash) {
        const speed = 0;

        for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
          const slide = swiper.slides.eq(i);
          const slideHash =
            slide.attr("data-hash") || slide.attr("data-history");

          if (
            slideHash === hash &&
            !slide.hasClass(swiper.params.slideDuplicateClass)
          ) {
            const index = slide.index();
            swiper.slideTo(
              index,
              speed,
              swiper.params.runCallbacksOnInit,
              true
            );
          }
        }
      }

      if (swiper.params.hashNavigation.watchState) {
        $(window).on("hashchange", onHashChange);
      }
    };

    const destroy = () => {
      if (swiper.params.hashNavigation.watchState) {
        $(window).off("hashchange", onHashChange);
      }
    };

    on("init", () => {
      if (swiper.params.hashNavigation.enabled) {
        init();
      }
    });
    on("destroy", () => {
      if (swiper.params.hashNavigation.enabled) {
        destroy();
      }
    });
    on("transitionEnd _freeModeNoMomentumRelease", () => {
      if (initialized) {
        setHash();
      }
    });
    on("slideChange", () => {
      if (initialized && swiper.params.cssMode) {
        setHash();
      }
    });
  }

  /* eslint no-underscore-dangle: "off" */
  function Autoplay(_ref) {
    let { swiper, extendParams, on, emit } = _ref;
    let timeout;
    swiper.autoplay = {
      running: false,
      paused: false,
    };
    extendParams({
      autoplay: {
        enabled: false,
        delay: 3000,
        waitForTransition: true,
        disableOnInteraction: true,
        stopOnLastSlide: false,
        reverseDirection: false,
        pauseOnMouseEnter: false,
      },
    });

    function run() {
      const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
      let delay = swiper.params.autoplay.delay;

      if ($activeSlideEl.attr("data-swiper-autoplay")) {
        delay =
          $activeSlideEl.attr("data-swiper-autoplay") ||
          swiper.params.autoplay.delay;
      }

      clearTimeout(timeout);
      timeout = nextTick(() => {
        let autoplayResult;

        if (swiper.params.autoplay.reverseDirection) {
          if (swiper.params.loop) {
            swiper.loopFix();
            autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
            emit("autoplay");
          } else if (!swiper.isBeginning) {
            autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
            emit("autoplay");
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            autoplayResult = swiper.slideTo(
              swiper.slides.length - 1,
              swiper.params.speed,
              true,
              true
            );
            emit("autoplay");
          } else {
            stop();
          }
        } else if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
          emit("autoplay");
        } else if (!swiper.isEnd) {
          autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
          emit("autoplay");
        } else {
          stop();
        }

        if (swiper.params.cssMode && swiper.autoplay.running) run();
        else if (autoplayResult === false) {
          run();
        }
      }, delay);
    }

    function start() {
      if (typeof timeout !== "undefined") return false;
      if (swiper.autoplay.running) return false;
      swiper.autoplay.running = true;
      emit("autoplayStart");
      run();
      return true;
    }

    function stop() {
      if (!swiper.autoplay.running) return false;
      if (typeof timeout === "undefined") return false;

      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }

      swiper.autoplay.running = false;
      emit("autoplayStop");
      return true;
    }

    function pause(speed) {
      if (!swiper.autoplay.running) return;
      if (swiper.autoplay.paused) return;
      if (timeout) clearTimeout(timeout);
      swiper.autoplay.paused = true;

      if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
        swiper.autoplay.paused = false;
        run();
      } else {
        ["transitionend", "webkitTransitionEnd"].forEach((event) => {
          swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
        });
      }
    }

    function onVisibilityChange() {
      const document = getDocument();

      if (document.visibilityState === "hidden" && swiper.autoplay.running) {
        pause();
      }

      if (document.visibilityState === "visible" && swiper.autoplay.paused) {
        run();
        swiper.autoplay.paused = false;
      }
    }

    function onTransitionEnd(e) {
      if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
      if (e.target !== swiper.$wrapperEl[0]) return;
      ["transitionend", "webkitTransitionEnd"].forEach((event) => {
        swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
      });
      swiper.autoplay.paused = false;

      if (!swiper.autoplay.running) {
        stop();
      } else {
        run();
      }
    }

    function onMouseEnter() {
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        emit("autoplayPause");
        pause();
      }

      ["transitionend", "webkitTransitionEnd"].forEach((event) => {
        swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
      });
    }

    function onMouseLeave() {
      if (swiper.params.autoplay.disableOnInteraction) {
        return;
      }

      swiper.autoplay.paused = false;
      emit("autoplayResume");
      run();
    }

    function attachMouseEvents() {
      if (swiper.params.autoplay.pauseOnMouseEnter) {
        swiper.$el.on("mouseenter", onMouseEnter);
        swiper.$el.on("mouseleave", onMouseLeave);
      }
    }

    function detachMouseEvents() {
      swiper.$el.off("mouseenter", onMouseEnter);
      swiper.$el.off("mouseleave", onMouseLeave);
    }

    on("init", () => {
      if (swiper.params.autoplay.enabled) {
        start();
        const document = getDocument();
        document.addEventListener("visibilitychange", onVisibilityChange);
        attachMouseEvents();
      }
    });
    on("beforeTransitionStart", (_s, speed, internal) => {
      if (swiper.autoplay.running) {
        if (internal || !swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.pause(speed);
        } else {
          stop();
        }
      }
    });
    on("sliderFirstMove", () => {
      if (swiper.autoplay.running) {
        if (swiper.params.autoplay.disableOnInteraction) {
          stop();
        } else {
          pause();
        }
      }
    });
    on("touchEnd", () => {
      if (
        swiper.params.cssMode &&
        swiper.autoplay.paused &&
        !swiper.params.autoplay.disableOnInteraction
      ) {
        run();
      }
    });
    on("destroy", () => {
      detachMouseEvents();

      if (swiper.autoplay.running) {
        stop();
      }

      const document = getDocument();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    });
    Object.assign(swiper.autoplay, {
      pause,
      run,
      start,
      stop,
    });
  }

  function Thumb(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      thumbs: {
        swiper: null,
        multipleActiveThumbs: true,
        autoScrollOffset: 0,
        slideThumbActiveClass: "swiper-slide-thumb-active",
        thumbsContainerClass: "swiper-thumbs",
      },
    });
    let initialized = false;
    let swiperCreated = false;
    swiper.thumbs = {
      swiper: null,
    };

    function onThumbClick() {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      const clickedIndex = thumbsSwiper.clickedIndex;
      const clickedSlide = thumbsSwiper.clickedSlide;
      if (
        clickedSlide &&
        $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)
      )
        return;
      if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
      let slideToIndex;

      if (thumbsSwiper.params.loop) {
        slideToIndex = parseInt(
          $(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"),
          10
        );
      } else {
        slideToIndex = clickedIndex;
      }

      if (swiper.params.loop) {
        let currentIndex = swiper.activeIndex;

        if (
          swiper.slides
            .eq(currentIndex)
            .hasClass(swiper.params.slideDuplicateClass)
        ) {
          swiper.loopFix(); // eslint-disable-next-line

          swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
          currentIndex = swiper.activeIndex;
        }

        const prevIndex = swiper.slides
          .eq(currentIndex)
          .prevAll(`[data-swiper-slide-index="${slideToIndex}"]`)
          .eq(0)
          .index();
        const nextIndex = swiper.slides
          .eq(currentIndex)
          .nextAll(`[data-swiper-slide-index="${slideToIndex}"]`)
          .eq(0)
          .index();
        if (typeof prevIndex === "undefined") slideToIndex = nextIndex;
        else if (typeof nextIndex === "undefined") slideToIndex = prevIndex;
        else if (nextIndex - currentIndex < currentIndex - prevIndex)
          slideToIndex = nextIndex;
        else slideToIndex = prevIndex;
      }

      swiper.slideTo(slideToIndex);
    }

    function init() {
      const { thumbs: thumbsParams } = swiper.params;
      if (initialized) return false;
      initialized = true;
      const SwiperClass = swiper.constructor;

      if (thumbsParams.swiper instanceof SwiperClass) {
        swiper.thumbs.swiper = thumbsParams.swiper;
        Object.assign(swiper.thumbs.swiper.originalParams, {
          watchSlidesProgress: true,
          slideToClickedSlide: false,
        });
        Object.assign(swiper.thumbs.swiper.params, {
          watchSlidesProgress: true,
          slideToClickedSlide: false,
        });
      } else if (isObject(thumbsParams.swiper)) {
        const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
        Object.assign(thumbsSwiperParams, {
          watchSlidesProgress: true,
          slideToClickedSlide: false,
        });
        swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
        swiperCreated = true;
      }

      swiper.thumbs.swiper.$el.addClass(
        swiper.params.thumbs.thumbsContainerClass
      );
      swiper.thumbs.swiper.on("tap", onThumbClick);
      return true;
    }

    function update(initial) {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      const slidesPerView =
        thumbsSwiper.params.slidesPerView === "auto"
          ? thumbsSwiper.slidesPerViewDynamic()
          : thumbsSwiper.params.slidesPerView;
      const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
      const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

      if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
        let currentThumbsIndex = thumbsSwiper.activeIndex;
        let newThumbsIndex;
        let direction;

        if (thumbsSwiper.params.loop) {
          if (
            thumbsSwiper.slides
              .eq(currentThumbsIndex)
              .hasClass(thumbsSwiper.params.slideDuplicateClass)
          ) {
            thumbsSwiper.loopFix(); // eslint-disable-next-line

            thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
            currentThumbsIndex = thumbsSwiper.activeIndex;
          } // Find actual thumbs index to slide to

          const prevThumbsIndex = thumbsSwiper.slides
            .eq(currentThumbsIndex)
            .prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`)
            .eq(0)
            .index();
          const nextThumbsIndex = thumbsSwiper.slides
            .eq(currentThumbsIndex)
            .nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`)
            .eq(0)
            .index();

          if (typeof prevThumbsIndex === "undefined") {
            newThumbsIndex = nextThumbsIndex;
          } else if (typeof nextThumbsIndex === "undefined") {
            newThumbsIndex = prevThumbsIndex;
          } else if (
            nextThumbsIndex - currentThumbsIndex ===
            currentThumbsIndex - prevThumbsIndex
          ) {
            newThumbsIndex =
              thumbsSwiper.params.slidesPerGroup > 1
                ? nextThumbsIndex
                : currentThumbsIndex;
          } else if (
            nextThumbsIndex - currentThumbsIndex <
            currentThumbsIndex - prevThumbsIndex
          ) {
            newThumbsIndex = nextThumbsIndex;
          } else {
            newThumbsIndex = prevThumbsIndex;
          }

          direction =
            swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
        } else {
          newThumbsIndex = swiper.realIndex;
          direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
        }

        if (useOffset) {
          newThumbsIndex +=
            direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
        }

        if (
          thumbsSwiper.visibleSlidesIndexes &&
          thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0
        ) {
          if (thumbsSwiper.params.centeredSlides) {
            if (newThumbsIndex > currentThumbsIndex) {
              newThumbsIndex =
                newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
            } else {
              newThumbsIndex =
                newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
            }
          } else if (
            newThumbsIndex > currentThumbsIndex &&
            thumbsSwiper.params.slidesPerGroup === 1
          );

          thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
        }
      } // Activate thumbs

      let thumbsToActivate = 1;
      const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

      if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
        thumbsToActivate = swiper.params.slidesPerView;
      }

      if (!swiper.params.thumbs.multipleActiveThumbs) {
        thumbsToActivate = 1;
      }

      thumbsToActivate = Math.floor(thumbsToActivate);
      thumbsSwiper.slides.removeClass(thumbActiveClass);

      if (
        thumbsSwiper.params.loop ||
        (thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled)
      ) {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          thumbsSwiper.$wrapperEl
            .children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`)
            .addClass(thumbActiveClass);
        }
      } else {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          thumbsSwiper.slides
            .eq(swiper.realIndex + i)
            .addClass(thumbActiveClass);
        }
      }
    }

    on("beforeInit", () => {
      const { thumbs } = swiper.params;
      if (!thumbs || !thumbs.swiper) return;
      init();
      update(true);
    });
    on("slideChange update resize observerUpdate", () => {
      if (!swiper.thumbs.swiper) return;
      update();
    });
    on("setTransition", (_s, duration) => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      thumbsSwiper.setTransition(duration);
    });
    on("beforeDestroy", () => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;

      if (swiperCreated && thumbsSwiper) {
        thumbsSwiper.destroy();
      }
    });
    Object.assign(swiper.thumbs, {
      init,
      update,
    });
  }

  function freeMode(_ref) {
    let { swiper, extendParams, emit, once } = _ref;
    extendParams({
      freeMode: {
        enabled: false,
        momentum: true,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        momentumVelocityRatio: 1,
        sticky: false,
        minimumVelocity: 0.02,
      },
    });

    function onTouchStart() {
      const translate = swiper.getTranslate();
      swiper.setTranslate(translate);
      swiper.setTransition(0);
      swiper.touchEventsData.velocities.length = 0;
      swiper.freeMode.onTouchEnd({
        currentPos: swiper.rtl ? swiper.translate : -swiper.translate,
      });
    }

    function onTouchMove() {
      const { touchEventsData: data, touches } = swiper; // Velocity

      if (data.velocities.length === 0) {
        data.velocities.push({
          position: touches[swiper.isHorizontal() ? "startX" : "startY"],
          time: data.touchStartTime,
        });
      }

      data.velocities.push({
        position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
        time: now(),
      });
    }

    function onTouchEnd(_ref2) {
      let { currentPos } = _ref2;
      const {
        params,
        $wrapperEl,
        rtlTranslate: rtl,
        snapGrid,
        touchEventsData: data,
      } = swiper; // Time diff

      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime;

      if (currentPos < -swiper.minTranslate()) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }

      if (currentPos > -swiper.maxTranslate()) {
        if (swiper.slides.length < snapGrid.length) {
          swiper.slideTo(snapGrid.length - 1);
        } else {
          swiper.slideTo(swiper.slides.length - 1);
        }

        return;
      }

      if (params.freeMode.momentum) {
        if (data.velocities.length > 1) {
          const lastMoveEvent = data.velocities.pop();
          const velocityEvent = data.velocities.pop();
          const distance = lastMoveEvent.position - velocityEvent.position;
          const time = lastMoveEvent.time - velocityEvent.time;
          swiper.velocity = distance / time;
          swiper.velocity /= 2;

          if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
            swiper.velocity = 0;
          } // this implies that the user stopped moving a finger then released.
          // There would be no events with distance zero, so the last event is stale.

          if (time > 150 || now() - lastMoveEvent.time > 300) {
            swiper.velocity = 0;
          }
        } else {
          swiper.velocity = 0;
        }

        swiper.velocity *= params.freeMode.momentumVelocityRatio;
        data.velocities.length = 0;
        let momentumDuration = 1000 * params.freeMode.momentumRatio;
        const momentumDistance = swiper.velocity * momentumDuration;
        let newPosition = swiper.translate + momentumDistance;
        if (rtl) newPosition = -newPosition;
        let doBounce = false;
        let afterBouncePosition;
        const bounceAmount =
          Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
        let needsLoopFix;

        if (newPosition < swiper.maxTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition + swiper.maxTranslate() < -bounceAmount) {
              newPosition = swiper.maxTranslate() - bounceAmount;
            }

            afterBouncePosition = swiper.maxTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.maxTranslate();
          }

          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (newPosition > swiper.minTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition - swiper.minTranslate() > bounceAmount) {
              newPosition = swiper.minTranslate() + bounceAmount;
            }

            afterBouncePosition = swiper.minTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.minTranslate();
          }

          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (params.freeMode.sticky) {
          let nextSlide;

          for (let j = 0; j < snapGrid.length; j += 1) {
            if (snapGrid[j] > -newPosition) {
              nextSlide = j;
              break;
            }
          }

          if (
            Math.abs(snapGrid[nextSlide] - newPosition) <
              Math.abs(snapGrid[nextSlide - 1] - newPosition) ||
            swiper.swipeDirection === "next"
          ) {
            newPosition = snapGrid[nextSlide];
          } else {
            newPosition = snapGrid[nextSlide - 1];
          }

          newPosition = -newPosition;
        }

        if (needsLoopFix) {
          once("transitionEnd", () => {
            swiper.loopFix();
          });
        } // Fix duration

        if (swiper.velocity !== 0) {
          if (rtl) {
            momentumDuration = Math.abs(
              (-newPosition - swiper.translate) / swiper.velocity
            );
          } else {
            momentumDuration = Math.abs(
              (newPosition - swiper.translate) / swiper.velocity
            );
          }

          if (params.freeMode.sticky) {
            // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
            // event, then durations can be 20+ seconds to slide one (or zero!) slides.
            // It's easy to see this when simulating touch with mouse events. To fix this,
            // limit single-slide swipes to the default slide duration. This also has the
            // nice side effect of matching slide speed if the user stopped moving before
            // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
            // For faster swipes, also apply limits (albeit higher ones).
            const moveDistance = Math.abs(
              (rtl ? -newPosition : newPosition) - swiper.translate
            );
            const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

            if (moveDistance < currentSlideSize) {
              momentumDuration = params.speed;
            } else if (moveDistance < 2 * currentSlideSize) {
              momentumDuration = params.speed * 1.5;
            } else {
              momentumDuration = params.speed * 2.5;
            }
          }
        } else if (params.freeMode.sticky) {
          swiper.slideToClosest();
          return;
        }

        if (params.freeMode.momentumBounce && doBounce) {
          swiper.updateProgress(afterBouncePosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed || !data.allowMomentumBounce)
              return;
            emit("momentumBounce");
            swiper.setTransition(params.speed);
            setTimeout(() => {
              swiper.setTranslate(afterBouncePosition);
              $wrapperEl.transitionEnd(() => {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }, 0);
          });
        } else if (swiper.velocity) {
          emit("_freeModeNoMomentumRelease");
          swiper.updateProgress(newPosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);

          if (!swiper.animating) {
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }
        } else {
          swiper.updateProgress(newPosition);
        }

        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      } else if (params.freeMode) {
        emit("_freeModeNoMomentumRelease");
      }

      if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
    }

    Object.assign(swiper, {
      freeMode: {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
      },
    });
  }

  function Grid(_ref) {
    let { swiper, extendParams } = _ref;
    extendParams({
      grid: {
        rows: 1,
        fill: "column",
      },
    });
    let slidesNumberEvenToRows;
    let slidesPerRow;
    let numFullColumns;

    const initSlides = (slidesLength) => {
      const { slidesPerView } = swiper.params;
      const { rows, fill } = swiper.params.grid;
      slidesPerRow = slidesNumberEvenToRows / rows;
      numFullColumns = Math.floor(slidesLength / rows);

      if (Math.floor(slidesLength / rows) === slidesLength / rows) {
        slidesNumberEvenToRows = slidesLength;
      } else {
        slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
      }

      if (slidesPerView !== "auto" && fill === "row") {
        slidesNumberEvenToRows = Math.max(
          slidesNumberEvenToRows,
          slidesPerView * rows
        );
      }
    };

    const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
      const { slidesPerGroup, spaceBetween } = swiper.params;
      const { rows, fill } = swiper.params.grid; // Set slides order

      let newSlideOrderIndex;
      let column;
      let row;

      if (fill === "row" && slidesPerGroup > 1) {
        const groupIndex = Math.floor(i / (slidesPerGroup * rows));
        const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
        const columnsInGroup =
          groupIndex === 0
            ? slidesPerGroup
            : Math.min(
                Math.ceil(
                  (slidesLength - groupIndex * rows * slidesPerGroup) / rows
                ),
                slidesPerGroup
              );
        row = Math.floor(slideIndexInGroup / columnsInGroup);
        column =
          slideIndexInGroup -
          row * columnsInGroup +
          groupIndex * slidesPerGroup;
        newSlideOrderIndex = column + (row * slidesNumberEvenToRows) / rows;
        slide.css({
          "-webkit-order": newSlideOrderIndex,
          order: newSlideOrderIndex,
        });
      } else if (fill === "column") {
        column = Math.floor(i / rows);
        row = i - column * rows;

        if (
          column > numFullColumns ||
          (column === numFullColumns && row === rows - 1)
        ) {
          row += 1;

          if (row >= rows) {
            row = 0;
            column += 1;
          }
        }
      } else {
        row = Math.floor(i / slidesPerRow);
        column = i - row * slidesPerRow;
      }

      slide.css(
        getDirectionLabel("margin-top"),
        row !== 0 ? spaceBetween && `${spaceBetween}px` : ""
      );
    };

    const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
      const { spaceBetween, centeredSlides, roundLengths } = swiper.params;
      const { rows } = swiper.params.grid;
      swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
      swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
      swiper.$wrapperEl.css({
        [getDirectionLabel("width")]: `${swiper.virtualSize + spaceBetween}px`,
      });

      if (centeredSlides) {
        snapGrid.splice(0, snapGrid.length);
        const newSlidesGrid = [];

        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
          if (snapGrid[i] < swiper.virtualSize + snapGrid[0])
            newSlidesGrid.push(slidesGridItem);
        }

        snapGrid.push(...newSlidesGrid);
      }
    };

    swiper.grid = {
      initSlides,
      updateSlide,
      updateWrapperSize,
    };
  }

  function appendSlide(slides) {
    const swiper = this;
    const { $wrapperEl, params } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }

    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }
    } else {
      $wrapperEl.append(slides);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }
  }

  function prependSlide(slides) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }

    let newActiveIndex = activeIndex + 1;

    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.prepend(slides[i]);
      }

      newActiveIndex = activeIndex + slides.length;
    } else {
      $wrapperEl.prepend(slides);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    swiper.slideTo(newActiveIndex, 0, false);
  }

  function addSlide(index, slides) {
    const swiper = this;
    const { $wrapperEl, params, activeIndex } = swiper;
    let activeIndexBuffer = activeIndex;

    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }

    const baseLength = swiper.slides.length;

    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }

    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }

    let newActiveIndex =
      activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const slidesBuffer = [];

    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides.eq(i);
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }

    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }

      newActiveIndex =
        activeIndexBuffer > index
          ? activeIndexBuffer + slides.length
          : activeIndexBuffer;
    } else {
      $wrapperEl.append(slides);
    }

    for (let i = 0; i < slidesBuffer.length; i += 1) {
      $wrapperEl.append(slidesBuffer[i]);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeSlide(slidesIndexes) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;
    let activeIndexBuffer = activeIndex;

    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }

    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;

    if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove])
          swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      }

      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove])
        swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeAllSlides() {
    const swiper = this;
    const slidesIndexes = [];

    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }

    swiper.removeSlide(slidesIndexes);
  }

  function Manipulation(_ref) {
    let { swiper } = _ref;
    Object.assign(swiper, {
      appendSlide: appendSlide.bind(swiper),
      prependSlide: prependSlide.bind(swiper),
      addSlide: addSlide.bind(swiper),
      removeSlide: removeSlide.bind(swiper),
      removeAllSlides: removeAllSlides.bind(swiper),
    });
  }

  function effectInit(params) {
    const {
      effect,
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams,
      perspective,
    } = params;
    on("beforeInit", () => {
      if (swiper.params.effect !== effect) return;
      swiper.classNames.push(
        `${swiper.params.containerModifierClass}${effect}`
      );

      if (perspective && perspective()) {
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      }

      const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
      Object.assign(swiper.params, overwriteParamsResult);
      Object.assign(swiper.originalParams, overwriteParamsResult);
    });
    on("setTranslate", () => {
      if (swiper.params.effect !== effect) return;
      setTranslate();
    });
    on("setTransition", (_s, duration) => {
      if (swiper.params.effect !== effect) return;
      setTransition(duration);
    });
    let requireUpdateOnVirtual;
    on("virtualUpdate", () => {
      if (!swiper.slides.length) {
        requireUpdateOnVirtual = true;
      }

      requestAnimationFrame(() => {
        if (requireUpdateOnVirtual && swiper.slides.length) {
          setTranslate();
          requireUpdateOnVirtual = false;
        }
      });
    });
  }

  function effectTarget(effectParams, $slideEl) {
    if (effectParams.transformEl) {
      return $slideEl.find(effectParams.transformEl).css({
        "backface-visibility": "hidden",
        "-webkit-backface-visibility": "hidden",
      });
    }

    return $slideEl;
  }

  function effectVirtualTransitionEnd(_ref) {
    let { swiper, duration, transformEl, allSlides } = _ref;
    const { slides, activeIndex, $wrapperEl } = swiper;

    if (swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      let $transitionEndTarget;

      if (allSlides) {
        $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
      } else {
        $transitionEndTarget = transformEl
          ? slides.eq(activeIndex).find(transformEl)
          : slides.eq(activeIndex);
      }

      $transitionEndTarget.transitionEnd(() => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const triggerEvents = ["webkitTransitionEnd", "transitionend"];

        for (let i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }

  function EffectFade(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      fadeEffect: {
        crossFade: false,
        transformEl: null,
      },
    });

    const setTranslate = () => {
      const { slides } = swiper;
      const params = swiper.params.fadeEffect;

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = swiper.slides.eq(i);
        const offset = $slideEl[0].swiperSlideOffset;
        let tx = -offset;
        if (!swiper.params.virtualTranslate) tx -= swiper.translate;
        let ty = 0;

        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
        }

        const slideOpacity = swiper.params.fadeEffect.crossFade
          ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
          : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
        const $targetEl = effectTarget(params, $slideEl);
        $targetEl
          .css({
            opacity: slideOpacity,
          })
          .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
      }
    };

    const setTransition = (duration) => {
      const { transformEl } = swiper.params.fadeEffect;
      const $transitionElements = transformEl
        ? swiper.slides.find(transformEl)
        : swiper.slides;
      $transitionElements.transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
        allSlides: true,
      });
    };

    effectInit({
      effect: "fade",
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode,
      }),
    });
  }

  function EffectCube(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      cubeEffect: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
    });

    const setTranslate = () => {
      const {
        $el,
        $wrapperEl,
        slides,
        width: swiperWidth,
        height: swiperHeight,
        rtlTranslate: rtl,
        size: swiperSize,
        browser,
      } = swiper;
      const params = swiper.params.cubeEffect;
      const isHorizontal = swiper.isHorizontal();
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let wrapperRotate = 0;
      let $cubeShadowEl;

      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl = $wrapperEl.find(".swiper-cube-shadow");

          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
            $wrapperEl.append($cubeShadowEl);
          }

          $cubeShadowEl.css({
            height: `${swiperWidth}px`,
          });
        } else {
          $cubeShadowEl = $el.find(".swiper-cube-shadow");

          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
            $el.append($cubeShadowEl);
          }
        }
      }

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        let slideIndex = i;

        if (isVirtual) {
          slideIndex = parseInt($slideEl.attr("data-swiper-slide-index"), 10);
        }

        let slideAngle = slideIndex * 90;
        let round = Math.floor(slideAngle / 360);

        if (rtl) {
          slideAngle = -slideAngle;
          round = Math.floor(-slideAngle / 360);
        }

        const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
        let tx = 0;
        let ty = 0;
        let tz = 0;

        if (slideIndex % 4 === 0) {
          tx = -round * 4 * swiperSize;
          tz = 0;
        } else if ((slideIndex - 1) % 4 === 0) {
          tx = 0;
          tz = -round * 4 * swiperSize;
        } else if ((slideIndex - 2) % 4 === 0) {
          tx = swiperSize + round * 4 * swiperSize;
          tz = swiperSize;
        } else if ((slideIndex - 3) % 4 === 0) {
          tx = -swiperSize;
          tz = 3 * swiperSize + swiperSize * 4 * round;
        }

        if (rtl) {
          tx = -tx;
        }

        if (!isHorizontal) {
          ty = tx;
          tx = 0;
        }

        const transform = `rotateX(${
          isHorizontal ? 0 : -slideAngle
        }deg) rotateY(${
          isHorizontal ? slideAngle : 0
        }deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

        if (progress <= 1 && progress > -1) {
          wrapperRotate = slideIndex * 90 + progress * 90;
          if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
        }

        $slideEl.transform(transform);

        if (params.slideShadows) {
          // Set shadows
          let shadowBefore = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-left")
            : $slideEl.find(".swiper-slide-shadow-top");
          let shadowAfter = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-right")
            : $slideEl.find(".swiper-slide-shadow-bottom");

          if (shadowBefore.length === 0) {
            shadowBefore = $(
              `<div class="swiper-slide-shadow-${
                isHorizontal ? "left" : "top"
              }"></div>`
            );
            $slideEl.append(shadowBefore);
          }

          if (shadowAfter.length === 0) {
            shadowAfter = $(
              `<div class="swiper-slide-shadow-${
                isHorizontal ? "right" : "bottom"
              }"></div>`
            );
            $slideEl.append(shadowAfter);
          }

          if (shadowBefore.length)
            shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length)
            shadowAfter[0].style.opacity = Math.max(progress, 0);
        }
      }

      $wrapperEl.css({
        "-webkit-transform-origin": `50% 50% -${swiperSize / 2}px`,
        "transform-origin": `50% 50% -${swiperSize / 2}px`,
      });

      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl.transform(
            `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${
              -swiperWidth / 2
            }px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`
          );
        } else {
          const shadowAngle =
            Math.abs(wrapperRotate) -
            Math.floor(Math.abs(wrapperRotate) / 90) * 90;
          const multiplier =
            1.5 -
            (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2 +
              Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2);
          const scale1 = params.shadowScale;
          const scale2 = params.shadowScale / multiplier;
          const offset = params.shadowOffset;
          $cubeShadowEl.transform(
            `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${
              swiperHeight / 2 + offset
            }px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`
          );
        }
      }

      const zFactor =
        browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
      $wrapperEl.transform(
        `translate3d(0px,0,${zFactor}px) rotateX(${
          swiper.isHorizontal() ? 0 : wrapperRotate
        }deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`
      );
    };

    const setTransition = (duration) => {
      const { $el, slides } = swiper;
      slides
        .transition(duration)
        .find(
          ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
        )
        .transition(duration);

      if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
        $el.find(".swiper-cube-shadow").transition(duration);
      }
    };

    effectInit({
      effect: "cube",
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true,
      }),
    });
  }

  function createShadow(params, $slideEl, side) {
    const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}`;
    const $shadowContainer = params.transformEl
      ? $slideEl.find(params.transformEl)
      : $slideEl;
    let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

    if (!$shadowEl.length) {
      $shadowEl = $(
        `<div class="swiper-slide-shadow${side ? `-${side}` : ""}"></div>`
      );
      $shadowContainer.append($shadowEl);
    }

    return $shadowEl;
  }

  function EffectFlip(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      flipEffect: {
        slideShadows: true,
        limitRotation: true,
        transformEl: null,
      },
    });

    const setTranslate = () => {
      const { slides, rtlTranslate: rtl } = swiper;
      const params = swiper.params.flipEffect;

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        let progress = $slideEl[0].progress;

        if (swiper.params.flipEffect.limitRotation) {
          progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
        }

        const offset = $slideEl[0].swiperSlideOffset;
        const rotate = -180 * progress;
        let rotateY = rotate;
        let rotateX = 0;
        let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let ty = 0;

        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
          rotateX = -rotateY;
          rotateY = 0;
        } else if (rtl) {
          rotateY = -rotateY;
        }

        $slideEl[0].style.zIndex =
          -Math.abs(Math.round(progress)) + slides.length;

        if (params.slideShadows) {
          // Set shadows
          let shadowBefore = swiper.isHorizontal()
            ? $slideEl.find(".swiper-slide-shadow-left")
            : $slideEl.find(".swiper-slide-shadow-top");
          let shadowAfter = swiper.isHorizontal()
            ? $slideEl.find(".swiper-slide-shadow-right")
            : $slideEl.find(".swiper-slide-shadow-bottom");

          if (shadowBefore.length === 0) {
            shadowBefore = createShadow(
              params,
              $slideEl,
              swiper.isHorizontal() ? "left" : "top"
            );
          }

          if (shadowAfter.length === 0) {
            shadowAfter = createShadow(
              params,
              $slideEl,
              swiper.isHorizontal() ? "right" : "bottom"
            );
          }

          if (shadowBefore.length)
            shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length)
            shadowAfter[0].style.opacity = Math.max(progress, 0);
        }

        const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        const $targetEl = effectTarget(params, $slideEl);
        $targetEl.transform(transform);
      }
    };

    const setTransition = (duration) => {
      const { transformEl } = swiper.params.flipEffect;
      const $transitionElements = transformEl
        ? swiper.slides.find(transformEl)
        : swiper.slides;
      $transitionElements
        .transition(duration)
        .find(
          ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
        )
        .transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
      });
    };

    effectInit({
      effect: "flip",
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode,
      }),
    });
  }

  function EffectCoverflow(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        scale: 1,
        modifier: 1,
        slideShadows: true,
        transformEl: null,
      },
    });

    const setTranslate = () => {
      const {
        width: swiperWidth,
        height: swiperHeight,
        slides,
        slidesSizesGrid,
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform = swiper.translate;
      const center = isHorizontal
        ? -transform + swiperWidth / 2
        : -transform + swiperHeight / 2;
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth; // Each slide offset from center

      for (let i = 0, length = slides.length; i < length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideSize = slidesSizesGrid[i];
        const slideOffset = $slideEl[0].swiperSlideOffset;
        const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
        const offsetMultiplier =
          typeof params.modifier === "function"
            ? params.modifier(centerOffset)
            : centerOffset * params.modifier;
        let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

        let translateZ = -translate * Math.abs(offsetMultiplier);
        let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

        if (typeof stretch === "string" && stretch.indexOf("%") !== -1) {
          stretch = (parseFloat(params.stretch) / 100) * slideSize;
        }

        let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
        let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
        let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        if (Math.abs(scale) < 0.001) scale = 0;
        const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        const $targetEl = effectTarget(params, $slideEl);
        $targetEl.transform(slideTransform);
        $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

        if (params.slideShadows) {
          // Set shadows
          let $shadowBeforeEl = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-left")
            : $slideEl.find(".swiper-slide-shadow-top");
          let $shadowAfterEl = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-right")
            : $slideEl.find(".swiper-slide-shadow-bottom");

          if ($shadowBeforeEl.length === 0) {
            $shadowBeforeEl = createShadow(
              params,
              $slideEl,
              isHorizontal ? "left" : "top"
            );
          }

          if ($shadowAfterEl.length === 0) {
            $shadowAfterEl = createShadow(
              params,
              $slideEl,
              isHorizontal ? "right" : "bottom"
            );
          }

          if ($shadowBeforeEl.length)
            $shadowBeforeEl[0].style.opacity =
              offsetMultiplier > 0 ? offsetMultiplier : 0;
          if ($shadowAfterEl.length)
            $shadowAfterEl[0].style.opacity =
              -offsetMultiplier > 0 ? -offsetMultiplier : 0;
        }
      }
    };

    const setTransition = (duration) => {
      const { transformEl } = swiper.params.coverflowEffect;
      const $transitionElements = transformEl
        ? swiper.slides.find(transformEl)
        : swiper.slides;
      $transitionElements
        .transition(duration)
        .find(
          ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
        )
        .transition(duration);
    };

    effectInit({
      effect: "coverflow",
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        watchSlidesProgress: true,
      }),
    });
  }

  function EffectCreative(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      creativeEffect: {
        transformEl: null,
        limitProgress: 1,
        shadowPerProgress: false,
        progressMultiplier: 1,
        perspective: true,
        prev: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1,
        },
        next: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1,
        },
      },
    });

    const getTranslateValue = (value) => {
      if (typeof value === "string") return value;
      return `${value}px`;
    };

    const setTranslate = () => {
      const { slides, $wrapperEl, slidesSizesGrid } = swiper;
      const params = swiper.params.creativeEffect;
      const { progressMultiplier: multiplier } = params;
      const isCenteredSlides = swiper.params.centeredSlides;

      if (isCenteredSlides) {
        const margin =
          slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
        $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
      }

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideProgress = $slideEl[0].progress;
        const progress = Math.min(
          Math.max($slideEl[0].progress, -params.limitProgress),
          params.limitProgress
        );
        let originalProgress = progress;

        if (!isCenteredSlides) {
          originalProgress = Math.min(
            Math.max($slideEl[0].originalProgress, -params.limitProgress),
            params.limitProgress
          );
        }

        const offset = $slideEl[0].swiperSlideOffset;
        const t = [
          swiper.params.cssMode ? -offset - swiper.translate : -offset,
          0,
          0,
        ];
        const r = [0, 0, 0];
        let custom = false;

        if (!swiper.isHorizontal()) {
          t[1] = t[0];
          t[0] = 0;
        }

        let data = {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          scale: 1,
          opacity: 1,
        };

        if (progress < 0) {
          data = params.next;
          custom = true;
        } else if (progress > 0) {
          data = params.prev;
          custom = true;
        } // set translate

        t.forEach((value, index) => {
          t[index] = `calc(${value}px + (${getTranslateValue(
            data.translate[index]
          )} * ${Math.abs(progress * multiplier)}))`;
        }); // set rotates

        r.forEach((value, index) => {
          r[index] = data.rotate[index] * Math.abs(progress * multiplier);
        });
        $slideEl[0].style.zIndex =
          -Math.abs(Math.round(slideProgress)) + slides.length;
        const translateString = t.join(", ");
        const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
        const scaleString =
          originalProgress < 0
            ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})`
            : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
        const opacityString =
          originalProgress < 0
            ? 1 + (1 - data.opacity) * originalProgress * multiplier
            : 1 - (1 - data.opacity) * originalProgress * multiplier;
        const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

        if ((custom && data.shadow) || !custom) {
          let $shadowEl = $slideEl.children(".swiper-slide-shadow");

          if ($shadowEl.length === 0 && data.shadow) {
            $shadowEl = createShadow(params, $slideEl);
          }

          if ($shadowEl.length) {
            const shadowOpacity = params.shadowPerProgress
              ? progress * (1 / params.limitProgress)
              : progress;
            $shadowEl[0].style.opacity = Math.min(
              Math.max(Math.abs(shadowOpacity), 0),
              1
            );
          }
        }

        const $targetEl = effectTarget(params, $slideEl);
        $targetEl.transform(transform).css({
          opacity: opacityString,
        });

        if (data.origin) {
          $targetEl.css("transform-origin", data.origin);
        }
      }
    };

    const setTransition = (duration) => {
      const { transformEl } = swiper.params.creativeEffect;
      const $transitionElements = transformEl
        ? swiper.slides.find(transformEl)
        : swiper.slides;
      $transitionElements
        .transition(duration)
        .find(".swiper-slide-shadow")
        .transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
        allSlides: true,
      });
    };

    effectInit({
      effect: "creative",
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => swiper.params.creativeEffect.perspective,
      overwriteParams: () => ({
        watchSlidesProgress: true,
        virtualTranslate: !swiper.params.cssMode,
      }),
    });
  }

  function EffectCards(_ref) {
    let { swiper, extendParams, on } = _ref;
    extendParams({
      cardsEffect: {
        slideShadows: true,
        transformEl: null,
      },
    });

    const setTranslate = () => {
      const { slides, activeIndex } = swiper;
      const params = swiper.params.cardsEffect;
      const { startTranslate, isTouched } = swiper.touchEventsData;
      const currentTranslate = swiper.translate;

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideProgress = $slideEl[0].progress;
        const progress = Math.min(Math.max(slideProgress, -4), 4);
        let offset = $slideEl[0].swiperSlideOffset;

        if (swiper.params.centeredSlides && !swiper.params.cssMode) {
          swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
        }

        if (swiper.params.centeredSlides && swiper.params.cssMode) {
          offset -= slides[0].swiperSlideOffset;
        }

        let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let tY = 0;
        const tZ = -100 * Math.abs(progress);
        let scale = 1;
        let rotate = -2 * progress;
        let tXAdd = 8 - Math.abs(progress) * 0.75;
        const slideIndex =
          swiper.virtual && swiper.params.virtual.enabled
            ? swiper.virtual.from + i
            : i;
        const isSwipeToNext =
          (slideIndex === activeIndex || slideIndex === activeIndex - 1) &&
          progress > 0 &&
          progress < 1 &&
          (isTouched || swiper.params.cssMode) &&
          currentTranslate < startTranslate;
        const isSwipeToPrev =
          (slideIndex === activeIndex || slideIndex === activeIndex + 1) &&
          progress < 0 &&
          progress > -1 &&
          (isTouched || swiper.params.cssMode) &&
          currentTranslate > startTranslate;

        if (isSwipeToNext || isSwipeToPrev) {
          const subProgress =
            (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
          rotate += -28 * progress * subProgress;
          scale += -0.5 * subProgress;
          tXAdd += 96 * subProgress;
          tY = `${-25 * subProgress * Math.abs(progress)}%`;
        }

        if (progress < 0) {
          // next
          tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
        } else if (progress > 0) {
          // prev
          tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
        } else {
          tX = `${tX}px`;
        }

        if (!swiper.isHorizontal()) {
          const prevY = tY;
          tY = tX;
          tX = prevY;
        }

        const scaleString =
          progress < 0
            ? `${1 + (1 - scale) * progress}`
            : `${1 - (1 - scale) * progress}`;
        const transform = `
      translate3d(${tX}, ${tY}, ${tZ}px)
      rotateZ(${rotate}deg)
      scale(${scaleString})
    `;

        if (params.slideShadows) {
          // Set shadows
          let $shadowEl = $slideEl.find(".swiper-slide-shadow");

          if ($shadowEl.length === 0) {
            $shadowEl = createShadow(params, $slideEl);
          }

          if ($shadowEl.length)
            $shadowEl[0].style.opacity = Math.min(
              Math.max((Math.abs(progress) - 0.5) / 0.5, 0),
              1
            );
        }

        $slideEl[0].style.zIndex =
          -Math.abs(Math.round(slideProgress)) + slides.length;
        const $targetEl = effectTarget(params, $slideEl);
        $targetEl.transform(transform);
      }
    };

    const setTransition = (duration) => {
      const { transformEl } = swiper.params.cardsEffect;
      const $transitionElements = transformEl
        ? swiper.slides.find(transformEl)
        : swiper.slides;
      $transitionElements
        .transition(duration)
        .find(".swiper-slide-shadow")
        .transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
      });
    };

    effectInit({
      effect: "cards",
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        watchSlidesProgress: true,
        virtualTranslate: !swiper.params.cssMode,
      }),
    });
  }

  // Swiper Class
  const modules = [
    Virtual,
    Keyboard,
    Mousewheel,
    Navigation,
    Pagination,
    Scrollbar,
    Parallax,
    Zoom,
    Lazy,
    Controller,
    A11y,
    History,
    HashNavigation,
    Autoplay,
    Thumb,
    freeMode,
    Grid,
    Manipulation,
    EffectFade,
    EffectCube,
    EffectFlip,
    EffectCoverflow,
    EffectCreative,
    EffectCards,
  ];
  Swiper.use(modules);

  return Swiper;
});

;
/*!
 * Glightbox v3.1.0
 * https://github.com/biati-digital/glightbox
 * Released under the MIT license
 */

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.GLightbox = factory()));
})(this, function () {
  "use strict";

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var uid = Date.now();
  function extend() {
    var extended = {};
    var deep = true;
    var i = 0;
    var length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
      deep = arguments[0];
      i++;
    }

    var merge = function merge(obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (
            deep &&
            Object.prototype.toString.call(obj[prop]) === "[object Object]"
          ) {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;
  }
  function each(collection, callback) {
    if (
      isNode(collection) ||
      collection === window ||
      collection === document
    ) {
      collection = [collection];
    }

    if (!isArrayLike(collection) && !isObject(collection)) {
      collection = [collection];
    }

    if (size(collection) == 0) {
      return;
    }

    if (isArrayLike(collection) && !isObject(collection)) {
      var l = collection.length,
        i = 0;

      for (; i < l; i++) {
        if (
          callback.call(collection[i], collection[i], i, collection) === false
        ) {
          break;
        }
      }
    } else if (isObject(collection)) {
      for (var key in collection) {
        if (has(collection, key)) {
          if (
            callback.call(collection[key], collection[key], key, collection) ===
            false
          ) {
            break;
          }
        }
      }
    }
  }
  function getNodeEvents(node) {
    var name =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var fn =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var cache = (node[uid] = node[uid] || []);
    var data = {
      all: cache,
      evt: null,
      found: null,
    };

    if (name && fn && size(cache) > 0) {
      each(cache, function (cl, i) {
        if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
          data.found = true;
          data.evt = i;
          return false;
        }
      });
    }

    return data;
  }
  function addEvent(eventName) {
    var _ref =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      onElement = _ref.onElement,
      withCallback = _ref.withCallback,
      _ref$avoidDuplicate = _ref.avoidDuplicate,
      avoidDuplicate =
        _ref$avoidDuplicate === void 0 ? true : _ref$avoidDuplicate,
      _ref$once = _ref.once,
      once = _ref$once === void 0 ? false : _ref$once,
      _ref$useCapture = _ref.useCapture,
      useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture;

    var thisArg = arguments.length > 2 ? arguments[2] : undefined;
    var element = onElement || [];

    if (isString(element)) {
      element = document.querySelectorAll(element);
    }

    function handler(event) {
      if (isFunction(withCallback)) {
        withCallback.call(thisArg, event, this);
      }

      if (once) {
        handler.destroy();
      }
    }

    handler.destroy = function () {
      each(element, function (el) {
        var events = getNodeEvents(el, eventName, handler);

        if (events.found) {
          events.all.splice(events.evt, 1);
        }

        if (el.removeEventListener) {
          el.removeEventListener(eventName, handler, useCapture);
        }
      });
    };

    each(element, function (el) {
      var events = getNodeEvents(el, eventName, handler);

      if (
        (el.addEventListener && avoidDuplicate && !events.found) ||
        !avoidDuplicate
      ) {
        el.addEventListener(eventName, handler, useCapture);
        events.all.push({
          eventName: eventName,
          fn: handler,
        });
      }
    });
    return handler;
  }
  function addClass(node, name) {
    each(name.split(" "), function (cl) {
      return node.classList.add(cl);
    });
  }
  function removeClass(node, name) {
    each(name.split(" "), function (cl) {
      return node.classList.remove(cl);
    });
  }
  function hasClass(node, name) {
    return node.classList.contains(name);
  }
  function closest(elem, selector) {
    while (elem !== document.body) {
      elem = elem.parentElement;

      if (!elem) {
        return false;
      }

      var matches =
        typeof elem.matches == "function"
          ? elem.matches(selector)
          : elem.msMatchesSelector(selector);

      if (matches) {
        return elem;
      }
    }
  }
  function animateElement(element) {
    var animation =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var callback =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!element || animation === "") {
      return false;
    }

    if (animation == "none") {
      if (isFunction(callback)) {
        callback();
      }

      return false;
    }

    var animationEnd = whichAnimationEvent();
    var animationNames = animation.split(" ");
    each(animationNames, function (name) {
      addClass(element, "g" + name);
    });
    addEvent(animationEnd, {
      onElement: element,
      avoidDuplicate: false,
      once: true,
      withCallback: function withCallback(event, target) {
        each(animationNames, function (name) {
          removeClass(target, "g" + name);
        });

        if (isFunction(callback)) {
          callback();
        }
      },
    });
  }
  function cssTransform(node) {
    var translate =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (translate == "") {
      node.style.webkitTransform = "";
      node.style.MozTransform = "";
      node.style.msTransform = "";
      node.style.OTransform = "";
      node.style.transform = "";
      return false;
    }

    node.style.webkitTransform = translate;
    node.style.MozTransform = translate;
    node.style.msTransform = translate;
    node.style.OTransform = translate;
    node.style.transform = translate;
  }
  function show(element) {
    element.style.display = "block";
  }
  function hide(element) {
    element.style.display = "none";
  }
  function createHTML(htmlStr) {
    var frag = document.createDocumentFragment(),
      temp = document.createElement("div");
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    return frag;
  }
  function windowSize() {
    return {
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
    };
  }
  function whichAnimationEvent() {
    var t,
      el = document.createElement("fakeelement");
    var animations = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd",
    };

    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
  function whichTransitionEvent() {
    var t,
      el = document.createElement("fakeelement");
    var transitions = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd",
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }
  function createIframe(config) {
    var url = config.url,
      allow = config.allow,
      callback = config.callback,
      appendTo = config.appendTo;
    var iframe = document.createElement("iframe");
    iframe.className = "vimeo-video gvideo";
    iframe.src = url;
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    if (allow) {
      iframe.setAttribute("allow", allow);
    }

    iframe.onload = function () {
      addClass(iframe, "node-ready");

      if (isFunction(callback)) {
        callback();
      }
    };

    if (appendTo) {
      appendTo.appendChild(iframe);
    }

    return iframe;
  }
  function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
      onComplete();
      return;
    }

    if (!delay) {
      delay = 100;
    }

    var timeoutPointer;
    var intervalPointer = setInterval(function () {
      if (!check()) {
        return;
      }

      clearInterval(intervalPointer);

      if (timeoutPointer) {
        clearTimeout(timeoutPointer);
      }

      onComplete();
    }, delay);

    if (timeout) {
      timeoutPointer = setTimeout(function () {
        clearInterval(intervalPointer);
      }, timeout);
    }
  }
  function injectAssets(url, waitFor, callback) {
    if (isNil(url)) {
      console.error("Inject assets error");
      return;
    }

    if (isFunction(waitFor)) {
      callback = waitFor;
      waitFor = false;
    }

    if (isString(waitFor) && waitFor in window) {
      if (isFunction(callback)) {
        callback();
      }

      return;
    }

    var found;

    if (url.indexOf(".css") !== -1) {
      found = document.querySelectorAll('link[href="' + url + '"]');

      if (found && found.length > 0) {
        if (isFunction(callback)) {
          callback();
        }

        return;
      }

      var head = document.getElementsByTagName("head")[0];
      var headStyles = head.querySelectorAll('link[rel="stylesheet"]');
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = url;
      link.media = "all";

      if (headStyles) {
        head.insertBefore(link, headStyles[0]);
      } else {
        head.appendChild(link);
      }

      if (isFunction(callback)) {
        callback();
      }

      return;
    }

    found = document.querySelectorAll('script[src="' + url + '"]');

    if (found && found.length > 0) {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(
            function () {
              return typeof window[waitFor] !== "undefined";
            },
            function () {
              callback();
            }
          );
          return false;
        }

        callback();
      }

      return;
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = function () {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(
            function () {
              return typeof window[waitFor] !== "undefined";
            },
            function () {
              callback();
            }
          );
          return false;
        }

        callback();
      }
    };

    document.body.appendChild(script);
    return;
  }
  function isMobile() {
    return (
      "navigator" in window &&
      window.navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
      )
    );
  }
  function isTouch() {
    return (
      isMobile() !== null ||
      document.createTouch !== undefined ||
      "ontouchstart" in window ||
      "onmsgesturechange" in window ||
      navigator.msMaxTouchPoints
    );
  }
  function isFunction(f) {
    return typeof f === "function";
  }
  function isString(s) {
    return typeof s === "string";
  }
  function isNode(el) {
    return !!(el && el.nodeType && el.nodeType == 1);
  }
  function isArray(ar) {
    return Array.isArray(ar);
  }
  function isArrayLike(ar) {
    return ar && ar.length && isFinite(ar.length);
  }
  function isObject(o) {
    var type = _typeof(o);

    return type === "object" && o != null && !isFunction(o) && !isArray(o);
  }
  function isNil(o) {
    return o == null;
  }
  function has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  }
  function size(o) {
    if (isObject(o)) {
      if (o.keys) {
        return o.keys().length;
      }

      var l = 0;

      for (var k in o) {
        if (has(o, k)) {
          l++;
        }
      }

      return l;
    } else {
      return o.length;
    }
  }
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function getNextFocusElement() {
    var current =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var btns = document.querySelectorAll(".gbtn[data-taborder]:not(.disabled)");

    if (!btns.length) {
      return false;
    }

    if (btns.length == 1) {
      return btns[0];
    }

    if (typeof current == "string") {
      current = parseInt(current);
    }

    var orders = [];
    each(btns, function (btn) {
      orders.push(btn.getAttribute("data-taborder"));
    });
    var highestOrder = Math.max.apply(
      Math,
      orders.map(function (order) {
        return parseInt(order);
      })
    );
    var newIndex = current < 0 ? 1 : current + 1;

    if (newIndex > highestOrder) {
      newIndex = "1";
    }

    var nextOrders = orders.filter(function (el) {
      return el >= parseInt(newIndex);
    });
    var nextFocus = nextOrders.sort()[0];
    return document.querySelector(
      '.gbtn[data-taborder="'.concat(nextFocus, '"]')
    );
  }

  function keyboardNavigation(instance) {
    if (instance.events.hasOwnProperty("keyboard")) {
      return false;
    }

    instance.events["keyboard"] = addEvent("keydown", {
      onElement: window,
      withCallback: function withCallback(event, target) {
        event = event || window.event;
        var key = event.keyCode;

        if (key == 9) {
          var focusedButton = document.querySelector(".gbtn.focused");

          if (!focusedButton) {
            var activeElement =
              document.activeElement && document.activeElement.nodeName
                ? document.activeElement.nodeName.toLocaleLowerCase()
                : false;

            if (
              activeElement == "input" ||
              activeElement == "textarea" ||
              activeElement == "button"
            ) {
              return;
            }
          }

          event.preventDefault();
          var btns = document.querySelectorAll(".gbtn[data-taborder]");

          if (!btns || btns.length <= 0) {
            return;
          }

          if (!focusedButton) {
            var first = getNextFocusElement();

            if (first) {
              first.focus();
              addClass(first, "focused");
            }

            return;
          }

          var currentFocusOrder = focusedButton.getAttribute("data-taborder");
          var nextFocus = getNextFocusElement(currentFocusOrder);
          removeClass(focusedButton, "focused");

          if (nextFocus) {
            nextFocus.focus();
            addClass(nextFocus, "focused");
          }
        }

        if (key == 39) {
          instance.nextSlide();
        }

        if (key == 37) {
          instance.prevSlide();
        }

        if (key == 27) {
          instance.close();
        }
      },
    });
  }

  function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  function getAngle(v1, v2) {
    var mr = getLen(v1) * getLen(v2);

    if (mr === 0) {
      return 0;
    }

    var r = dot(v1, v2) / mr;

    if (r > 1) {
      r = 1;
    }

    return Math.acos(r);
  }

  function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
  }

  function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2);

    if (cross(v1, v2) > 0) {
      angle *= -1;
    }

    return (angle * 180) / Math.PI;
  }

  var EventsHandlerAdmin = (function () {
    function EventsHandlerAdmin(el) {
      _classCallCheck(this, EventsHandlerAdmin);

      this.handlers = [];
      this.el = el;
    }

    _createClass(EventsHandlerAdmin, [
      {
        key: "add",
        value: function add(handler) {
          this.handlers.push(handler);
        },
      },
      {
        key: "del",
        value: function del(handler) {
          if (!handler) {
            this.handlers = [];
          }

          for (var i = this.handlers.length; i >= 0; i--) {
            if (this.handlers[i] === handler) {
              this.handlers.splice(i, 1);
            }
          }
        },
      },
      {
        key: "dispatch",
        value: function dispatch() {
          for (var i = 0, len = this.handlers.length; i < len; i++) {
            var handler = this.handlers[i];

            if (typeof handler === "function") {
              handler.apply(this.el, arguments);
            }
          }
        },
      },
    ]);

    return EventsHandlerAdmin;
  })();

  function wrapFunc(el, handler) {
    var EventshandlerAdmin = new EventsHandlerAdmin(el);
    EventshandlerAdmin.add(handler);
    return EventshandlerAdmin;
  }

  var TouchEvents = (function () {
    function TouchEvents(el, option) {
      _classCallCheck(this, TouchEvents);

      this.element = typeof el == "string" ? document.querySelector(el) : el;
      this.start = this.start.bind(this);
      this.move = this.move.bind(this);
      this.end = this.end.bind(this);
      this.cancel = this.cancel.bind(this);
      this.element.addEventListener("touchstart", this.start, false);
      this.element.addEventListener("touchmove", this.move, false);
      this.element.addEventListener("touchend", this.end, false);
      this.element.addEventListener("touchcancel", this.cancel, false);
      this.preV = {
        x: null,
        y: null,
      };
      this.pinchStartLen = null;
      this.zoom = 1;
      this.isDoubleTap = false;

      var noop = function noop() {};

      this.rotate = wrapFunc(this.element, option.rotate || noop);
      this.touchStart = wrapFunc(this.element, option.touchStart || noop);
      this.multipointStart = wrapFunc(
        this.element,
        option.multipointStart || noop
      );
      this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
      this.pinch = wrapFunc(this.element, option.pinch || noop);
      this.swipe = wrapFunc(this.element, option.swipe || noop);
      this.tap = wrapFunc(this.element, option.tap || noop);
      this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
      this.longTap = wrapFunc(this.element, option.longTap || noop);
      this.singleTap = wrapFunc(this.element, option.singleTap || noop);
      this.pressMove = wrapFunc(this.element, option.pressMove || noop);
      this.twoFingerPressMove = wrapFunc(
        this.element,
        option.twoFingerPressMove || noop
      );
      this.touchMove = wrapFunc(this.element, option.touchMove || noop);
      this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
      this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
      this.translateContainer = this.element;
      this._cancelAllHandler = this.cancelAll.bind(this);
      window.addEventListener("scroll", this._cancelAllHandler);
      this.delta = null;
      this.last = null;
      this.now = null;
      this.tapTimeout = null;
      this.singleTapTimeout = null;
      this.longTapTimeout = null;
      this.swipeTimeout = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
      this.preTapPosition = {
        x: null,
        y: null,
      };
    }

    _createClass(TouchEvents, [
      {
        key: "start",
        value: function start(evt) {
          if (!evt.touches) {
            return;
          }

          var ignoreDragFor = ["a", "button", "input"];

          if (
            evt.target &&
            evt.target.nodeName &&
            ignoreDragFor.indexOf(evt.target.nodeName.toLowerCase()) >= 0
          ) {
            console.log(
              "ignore drag for this touched element",
              evt.target.nodeName.toLowerCase()
            );
            return;
          }

          this.now = Date.now();
          this.x1 = evt.touches[0].pageX;
          this.y1 = evt.touches[0].pageY;
          this.delta = this.now - (this.last || this.now);
          this.touchStart.dispatch(evt, this.element);

          if (this.preTapPosition.x !== null) {
            this.isDoubleTap =
              this.delta > 0 &&
              this.delta <= 250 &&
              Math.abs(this.preTapPosition.x - this.x1) < 30 &&
              Math.abs(this.preTapPosition.y - this.y1) < 30;

            if (this.isDoubleTap) {
              clearTimeout(this.singleTapTimeout);
            }
          }

          this.preTapPosition.x = this.x1;
          this.preTapPosition.y = this.y1;
          this.last = this.now;
          var preV = this.preV,
            len = evt.touches.length;

          if (len > 1) {
            this._cancelLongTap();

            this._cancelSingleTap();

            var v = {
              x: evt.touches[1].pageX - this.x1,
              y: evt.touches[1].pageY - this.y1,
            };
            preV.x = v.x;
            preV.y = v.y;
            this.pinchStartLen = getLen(preV);
            this.multipointStart.dispatch(evt, this.element);
          }

          this._preventTap = false;
          this.longTapTimeout = setTimeout(
            function () {
              this.longTap.dispatch(evt, this.element);
              this._preventTap = true;
            }.bind(this),
            750
          );
        },
      },
      {
        key: "move",
        value: function move(evt) {
          if (!evt.touches) {
            return;
          }

          var preV = this.preV,
            len = evt.touches.length,
            currentX = evt.touches[0].pageX,
            currentY = evt.touches[0].pageY;
          this.isDoubleTap = false;

          if (len > 1) {
            var sCurrentX = evt.touches[1].pageX,
              sCurrentY = evt.touches[1].pageY;
            var v = {
              x: evt.touches[1].pageX - currentX,
              y: evt.touches[1].pageY - currentY,
            };

            if (preV.x !== null) {
              if (this.pinchStartLen > 0) {
                evt.zoom = getLen(v) / this.pinchStartLen;
                this.pinch.dispatch(evt, this.element);
              }

              evt.angle = getRotateAngle(v, preV);
              this.rotate.dispatch(evt, this.element);
            }

            preV.x = v.x;
            preV.y = v.y;

            if (this.x2 !== null && this.sx2 !== null) {
              evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
              evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
            } else {
              evt.deltaX = 0;
              evt.deltaY = 0;
            }

            this.twoFingerPressMove.dispatch(evt, this.element);
            this.sx2 = sCurrentX;
            this.sy2 = sCurrentY;
          } else {
            if (this.x2 !== null) {
              evt.deltaX = currentX - this.x2;
              evt.deltaY = currentY - this.y2;
              var movedX = Math.abs(this.x1 - this.x2),
                movedY = Math.abs(this.y1 - this.y2);

              if (movedX > 10 || movedY > 10) {
                this._preventTap = true;
              }
            } else {
              evt.deltaX = 0;
              evt.deltaY = 0;
            }

            this.pressMove.dispatch(evt, this.element);
          }

          this.touchMove.dispatch(evt, this.element);

          this._cancelLongTap();

          this.x2 = currentX;
          this.y2 = currentY;

          if (len > 1) {
            evt.preventDefault();
          }
        },
      },
      {
        key: "end",
        value: function end(evt) {
          if (!evt.changedTouches) {
            return;
          }

          this._cancelLongTap();

          var self = this;

          if (evt.touches.length < 2) {
            this.multipointEnd.dispatch(evt, this.element);
            this.sx2 = this.sy2 = null;
          }

          if (
            (this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)
          ) {
            evt.direction = this._swipeDirection(
              this.x1,
              this.x2,
              this.y1,
              this.y2
            );
            this.swipeTimeout = setTimeout(function () {
              self.swipe.dispatch(evt, self.element);
            }, 0);
          } else {
            this.tapTimeout = setTimeout(function () {
              if (!self._preventTap) {
                self.tap.dispatch(evt, self.element);
              }

              if (self.isDoubleTap) {
                self.doubleTap.dispatch(evt, self.element);
                self.isDoubleTap = false;
              }
            }, 0);

            if (!self.isDoubleTap) {
              self.singleTapTimeout = setTimeout(function () {
                self.singleTap.dispatch(evt, self.element);
              }, 250);
            }
          }

          this.touchEnd.dispatch(evt, this.element);
          this.preV.x = 0;
          this.preV.y = 0;
          this.zoom = 1;
          this.pinchStartLen = null;
          this.x1 = this.x2 = this.y1 = this.y2 = null;
        },
      },
      {
        key: "cancelAll",
        value: function cancelAll() {
          this._preventTap = true;
          clearTimeout(this.singleTapTimeout);
          clearTimeout(this.tapTimeout);
          clearTimeout(this.longTapTimeout);
          clearTimeout(this.swipeTimeout);
        },
      },
      {
        key: "cancel",
        value: function cancel(evt) {
          this.cancelAll();
          this.touchCancel.dispatch(evt, this.element);
        },
      },
      {
        key: "_cancelLongTap",
        value: function _cancelLongTap() {
          clearTimeout(this.longTapTimeout);
        },
      },
      {
        key: "_cancelSingleTap",
        value: function _cancelSingleTap() {
          clearTimeout(this.singleTapTimeout);
        },
      },
      {
        key: "_swipeDirection",
        value: function _swipeDirection(x1, x2, y1, y2) {
          return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? x1 - x2 > 0
              ? "Left"
              : "Right"
            : y1 - y2 > 0
            ? "Up"
            : "Down";
        },
      },
      {
        key: "on",
        value: function on(evt, handler) {
          if (this[evt]) {
            this[evt].add(handler);
          }
        },
      },
      {
        key: "off",
        value: function off(evt, handler) {
          if (this[evt]) {
            this[evt].del(handler);
          }
        },
      },
      {
        key: "destroy",
        value: function destroy() {
          if (this.singleTapTimeout) {
            clearTimeout(this.singleTapTimeout);
          }

          if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
          }

          if (this.longTapTimeout) {
            clearTimeout(this.longTapTimeout);
          }

          if (this.swipeTimeout) {
            clearTimeout(this.swipeTimeout);
          }

          this.element.removeEventListener("touchstart", this.start);
          this.element.removeEventListener("touchmove", this.move);
          this.element.removeEventListener("touchend", this.end);
          this.element.removeEventListener("touchcancel", this.cancel);
          this.rotate.del();
          this.touchStart.del();
          this.multipointStart.del();
          this.multipointEnd.del();
          this.pinch.del();
          this.swipe.del();
          this.tap.del();
          this.doubleTap.del();
          this.longTap.del();
          this.singleTap.del();
          this.pressMove.del();
          this.twoFingerPressMove.del();
          this.touchMove.del();
          this.touchEnd.del();
          this.touchCancel.del();
          this.preV =
            this.pinchStartLen =
            this.zoom =
            this.isDoubleTap =
            this.delta =
            this.last =
            this.now =
            this.tapTimeout =
            this.singleTapTimeout =
            this.longTapTimeout =
            this.swipeTimeout =
            this.x1 =
            this.x2 =
            this.y1 =
            this.y2 =
            this.preTapPosition =
            this.rotate =
            this.touchStart =
            this.multipointStart =
            this.multipointEnd =
            this.pinch =
            this.swipe =
            this.tap =
            this.doubleTap =
            this.longTap =
            this.singleTap =
            this.pressMove =
            this.touchMove =
            this.touchEnd =
            this.touchCancel =
            this.twoFingerPressMove =
              null;
          window.removeEventListener("scroll", this._cancelAllHandler);
          return null;
        },
      },
    ]);

    return TouchEvents;
  })();

  function resetSlideMove(slide) {
    var transitionEnd = whichTransitionEvent();
    var windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    var media = hasClass(slide, "gslide-media")
      ? slide
      : slide.querySelector(".gslide-media");
    var container = closest(media, ".ginner-container");
    var desc = slide.querySelector(".gslide-description");

    if (windowWidth > 769) {
      media = container;
    }

    addClass(media, "greset");
    cssTransform(media, "translate3d(0, 0, 0)");
    addEvent(transitionEnd, {
      onElement: media,
      once: true,
      withCallback: function withCallback(event, target) {
        removeClass(media, "greset");
      },
    });
    media.style.opacity = "";

    if (desc) {
      desc.style.opacity = "";
    }
  }

  function touchNavigation(instance) {
    if (instance.events.hasOwnProperty("touch")) {
      return false;
    }

    var winSize = windowSize();
    var winWidth = winSize.width;
    var winHeight = winSize.height;
    var process = false;
    var currentSlide = null;
    var media = null;
    var mediaImage = null;
    var doingMove = false;
    var initScale = 1;
    var maxScale = 4.5;
    var currentScale = 1;
    var doingZoom = false;
    var imageZoomed = false;
    var zoomedPosX = null;
    var zoomedPosY = null;
    var lastZoomedPosX = null;
    var lastZoomedPosY = null;
    var hDistance;
    var vDistance;
    var hDistancePercent = 0;
    var vDistancePercent = 0;
    var vSwipe = false;
    var hSwipe = false;
    var startCoords = {};
    var endCoords = {};
    var xDown = 0;
    var yDown = 0;
    var isInlined;
    var sliderWrapper = document.getElementById("glightbox-slider");
    var overlay = document.querySelector(".goverlay");
    var touchInstance = new TouchEvents(sliderWrapper, {
      touchStart: function touchStart(e) {
        process = true;

        if (
          hasClass(e.targetTouches[0].target, "ginner-container") ||
          closest(e.targetTouches[0].target, ".gslide-desc") ||
          e.targetTouches[0].target.nodeName.toLowerCase() == "a"
        ) {
          process = false;
        }

        if (
          closest(e.targetTouches[0].target, ".gslide-inline") &&
          !hasClass(e.targetTouches[0].target.parentNode, "gslide-inline")
        ) {
          process = false;
        }

        if (process) {
          endCoords = e.targetTouches[0];
          startCoords.pageX = e.targetTouches[0].pageX;
          startCoords.pageY = e.targetTouches[0].pageY;
          xDown = e.targetTouches[0].clientX;
          yDown = e.targetTouches[0].clientY;
          currentSlide = instance.activeSlide;
          media = currentSlide.querySelector(".gslide-media");
          isInlined = currentSlide.querySelector(".gslide-inline");
          mediaImage = null;

          if (hasClass(media, "gslide-image")) {
            mediaImage = media.querySelector("img");
          }

          var windowWidth =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

          if (windowWidth > 769) {
            media = currentSlide.querySelector(".ginner-container");
          }

          removeClass(overlay, "greset");

          if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
            return;
          }

          e.preventDefault();
        }
      },
      touchMove: function touchMove(e) {
        if (!process) {
          return;
        }

        endCoords = e.targetTouches[0];

        if (doingZoom || imageZoomed) {
          return;
        }

        if (isInlined && isInlined.offsetHeight > winHeight) {
          var moved = startCoords.pageX - endCoords.pageX;

          if (Math.abs(moved) <= 13) {
            return false;
          }
        }

        doingMove = true;
        var xUp = e.targetTouches[0].clientX;
        var yUp = e.targetTouches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          vSwipe = false;
          hSwipe = true;
        } else {
          hSwipe = false;
          vSwipe = true;
        }

        hDistance = endCoords.pageX - startCoords.pageX;
        hDistancePercent = (hDistance * 100) / winWidth;
        vDistance = endCoords.pageY - startCoords.pageY;
        vDistancePercent = (vDistance * 100) / winHeight;
        var opacity;

        if (vSwipe && mediaImage) {
          opacity = 1 - Math.abs(vDistance) / winHeight;
          overlay.style.opacity = opacity;

          if (instance.settings.touchFollowAxis) {
            hDistancePercent = 0;
          }
        }

        if (hSwipe) {
          opacity = 1 - Math.abs(hDistance) / winWidth;
          media.style.opacity = opacity;

          if (instance.settings.touchFollowAxis) {
            vDistancePercent = 0;
          }
        }

        if (!mediaImage) {
          return cssTransform(
            media,
            "translate3d(".concat(hDistancePercent, "%, 0, 0)")
          );
        }

        cssTransform(
          media,
          "translate3d("
            .concat(hDistancePercent, "%, ")
            .concat(vDistancePercent, "%, 0)")
        );
      },
      touchEnd: function touchEnd() {
        if (!process) {
          return;
        }

        doingMove = false;

        if (imageZoomed || doingZoom) {
          lastZoomedPosX = zoomedPosX;
          lastZoomedPosY = zoomedPosY;
          return;
        }

        var v = Math.abs(parseInt(vDistancePercent));
        var h = Math.abs(parseInt(hDistancePercent));

        if (v > 29 && mediaImage) {
          instance.close();
          return;
        }

        if (v < 29 && h < 25) {
          addClass(overlay, "greset");
          overlay.style.opacity = 1;
          return resetSlideMove(media);
        }
      },
      multipointEnd: function multipointEnd() {
        setTimeout(function () {
          doingZoom = false;
        }, 50);
      },
      multipointStart: function multipointStart() {
        doingZoom = true;
        initScale = currentScale ? currentScale : 1;
      },
      pinch: function pinch(evt) {
        if (!mediaImage || doingMove) {
          return false;
        }

        doingZoom = true;
        mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
        var scale = initScale * evt.zoom;
        imageZoomed = true;

        if (scale <= 1) {
          imageZoomed = false;
          scale = 1;
          lastZoomedPosY = null;
          lastZoomedPosX = null;
          zoomedPosX = null;
          zoomedPosY = null;
          mediaImage.setAttribute("style", "");
          return;
        }

        if (scale > maxScale) {
          scale = maxScale;
        }

        mediaImage.style.transform = "scale3d("
          .concat(scale, ", ")
          .concat(scale, ", 1)");
        currentScale = scale;
      },
      pressMove: function pressMove(e) {
        if (imageZoomed && !doingZoom) {
          var mhDistance = endCoords.pageX - startCoords.pageX;
          var mvDistance = endCoords.pageY - startCoords.pageY;

          if (lastZoomedPosX) {
            mhDistance = mhDistance + lastZoomedPosX;
          }

          if (lastZoomedPosY) {
            mvDistance = mvDistance + lastZoomedPosY;
          }

          zoomedPosX = mhDistance;
          zoomedPosY = mvDistance;
          var style = "translate3d("
            .concat(mhDistance, "px, ")
            .concat(mvDistance, "px, 0)");

          if (currentScale) {
            style += " scale3d("
              .concat(currentScale, ", ")
              .concat(currentScale, ", 1)");
          }

          cssTransform(mediaImage, style);
        }
      },
      swipe: function swipe(evt) {
        if (imageZoomed) {
          return;
        }

        if (doingZoom) {
          doingZoom = false;
          return;
        }

        if (evt.direction == "Left") {
          if (instance.index == instance.elements.length - 1) {
            return resetSlideMove(media);
          }

          instance.nextSlide();
        }

        if (evt.direction == "Right") {
          if (instance.index == 0) {
            return resetSlideMove(media);
          }

          instance.prevSlide();
        }
      },
    });
    instance.events["touch"] = touchInstance;
  }

  var ZoomImages = (function () {
    function ZoomImages(el, slide) {
      var _this = this;

      var onclose =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : null;

      _classCallCheck(this, ZoomImages);

      this.img = el;
      this.slide = slide;
      this.onclose = onclose;

      if (this.img.setZoomEvents) {
        return false;
      }

      this.active = false;
      this.zoomedIn = false;
      this.dragging = false;
      this.currentX = null;
      this.currentY = null;
      this.initialX = null;
      this.initialY = null;
      this.xOffset = 0;
      this.yOffset = 0;
      this.img.addEventListener(
        "mousedown",
        function (e) {
          return _this.dragStart(e);
        },
        false
      );
      this.img.addEventListener(
        "mouseup",
        function (e) {
          return _this.dragEnd(e);
        },
        false
      );
      this.img.addEventListener(
        "mousemove",
        function (e) {
          return _this.drag(e);
        },
        false
      );
      this.img.addEventListener(
        "click",
        function (e) {
          if (_this.slide.classList.contains("dragging-nav")) {
            _this.zoomOut();

            return false;
          }

          if (!_this.zoomedIn) {
            return _this.zoomIn();
          }

          if (_this.zoomedIn && !_this.dragging) {
            _this.zoomOut();
          }
        },
        false
      );
      this.img.setZoomEvents = true;
    }

    _createClass(ZoomImages, [
      {
        key: "zoomIn",
        value: function zoomIn() {
          var winWidth = this.widowWidth();

          if (this.zoomedIn || winWidth <= 768) {
            return;
          }

          var img = this.img;
          img.setAttribute("data-style", img.getAttribute("style"));
          img.style.maxWidth = img.naturalWidth + "px";
          img.style.maxHeight = img.naturalHeight + "px";

          if (img.naturalWidth > winWidth) {
            var centerX = winWidth / 2 - img.naturalWidth / 2;
            this.setTranslate(this.img.parentNode, centerX, 0);
          }

          this.slide.classList.add("zoomed");
          this.zoomedIn = true;
        },
      },
      {
        key: "zoomOut",
        value: function zoomOut() {
          this.img.parentNode.setAttribute("style", "");
          this.img.setAttribute("style", this.img.getAttribute("data-style"));
          this.slide.classList.remove("zoomed");
          this.zoomedIn = false;
          this.currentX = null;
          this.currentY = null;
          this.initialX = null;
          this.initialY = null;
          this.xOffset = 0;
          this.yOffset = 0;

          if (this.onclose && typeof this.onclose == "function") {
            this.onclose();
          }
        },
      },
      {
        key: "dragStart",
        value: function dragStart(e) {
          e.preventDefault();

          if (!this.zoomedIn) {
            this.active = false;
            return;
          }

          if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
          } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
          }

          if (e.target === this.img) {
            this.active = true;
            this.img.classList.add("dragging");
          }
        },
      },
      {
        key: "dragEnd",
        value: function dragEnd(e) {
          var _this2 = this;

          e.preventDefault();
          this.initialX = this.currentX;
          this.initialY = this.currentY;
          this.active = false;
          setTimeout(function () {
            _this2.dragging = false;
            _this2.img.isDragging = false;

            _this2.img.classList.remove("dragging");
          }, 100);
        },
      },
      {
        key: "drag",
        value: function drag(e) {
          if (this.active) {
            e.preventDefault();

            if (e.type === "touchmove") {
              this.currentX = e.touches[0].clientX - this.initialX;
              this.currentY = e.touches[0].clientY - this.initialY;
            } else {
              this.currentX = e.clientX - this.initialX;
              this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.img.isDragging = true;
            this.dragging = true;
            this.setTranslate(this.img, this.currentX, this.currentY);
          }
        },
      },
      {
        key: "onMove",
        value: function onMove(e) {
          if (!this.zoomedIn) {
            return;
          }

          var xOffset = e.clientX - this.img.naturalWidth / 2;
          var yOffset = e.clientY - this.img.naturalHeight / 2;
          this.setTranslate(this.img, xOffset, yOffset);
        },
      },
      {
        key: "setTranslate",
        value: function setTranslate(node, xPos, yPos) {
          node.style.transform =
            "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        },
      },
      {
        key: "widowWidth",
        value: function widowWidth() {
          return (
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth
          );
        },
      },
    ]);

    return ZoomImages;
  })();

  var DragSlides = (function () {
    function DragSlides() {
      var _this = this;

      var config =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DragSlides);

      var dragEl = config.dragEl,
        _config$toleranceX = config.toleranceX,
        toleranceX = _config$toleranceX === void 0 ? 40 : _config$toleranceX,
        _config$toleranceY = config.toleranceY,
        toleranceY = _config$toleranceY === void 0 ? 65 : _config$toleranceY,
        _config$slide = config.slide,
        slide = _config$slide === void 0 ? null : _config$slide,
        _config$instance = config.instance,
        instance = _config$instance === void 0 ? null : _config$instance;
      this.el = dragEl;
      this.active = false;
      this.dragging = false;
      this.currentX = null;
      this.currentY = null;
      this.initialX = null;
      this.initialY = null;
      this.xOffset = 0;
      this.yOffset = 0;
      this.direction = null;
      this.lastDirection = null;
      this.toleranceX = toleranceX;
      this.toleranceY = toleranceY;
      this.toleranceReached = false;
      this.dragContainer = this.el;
      this.slide = slide;
      this.instance = instance;
      this.el.addEventListener(
        "mousedown",
        function (e) {
          return _this.dragStart(e);
        },
        false
      );
      this.el.addEventListener(
        "mouseup",
        function (e) {
          return _this.dragEnd(e);
        },
        false
      );
      this.el.addEventListener(
        "mousemove",
        function (e) {
          return _this.drag(e);
        },
        false
      );
    }

    _createClass(DragSlides, [
      {
        key: "dragStart",
        value: function dragStart(e) {
          if (this.slide.classList.contains("zoomed")) {
            this.active = false;
            return;
          }

          if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
          } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
          }

          var clicked = e.target.nodeName.toLowerCase();
          var exludeClicks = ["input", "select", "textarea", "button", "a"];

          if (
            e.target.classList.contains("nodrag") ||
            closest(e.target, ".nodrag") ||
            exludeClicks.indexOf(clicked) !== -1
          ) {
            this.active = false;
            return;
          }

          e.preventDefault();

          if (
            e.target === this.el ||
            (clicked !== "img" && closest(e.target, ".gslide-inline"))
          ) {
            this.active = true;
            this.el.classList.add("dragging");
            this.dragContainer = closest(e.target, ".ginner-container");
          }
        },
      },
      {
        key: "dragEnd",
        value: function dragEnd(e) {
          var _this2 = this;

          e && e.preventDefault();
          this.initialX = 0;
          this.initialY = 0;
          this.currentX = null;
          this.currentY = null;
          this.initialX = null;
          this.initialY = null;
          this.xOffset = 0;
          this.yOffset = 0;
          this.active = false;

          if (this.doSlideChange) {
            this.instance.preventOutsideClick = true;
            this.doSlideChange == "right" && this.instance.prevSlide();
            this.doSlideChange == "left" && this.instance.nextSlide();
          }

          if (this.doSlideClose) {
            this.instance.close();
          }

          if (!this.toleranceReached) {
            this.setTranslate(this.dragContainer, 0, 0, true);
          }

          setTimeout(function () {
            _this2.instance.preventOutsideClick = false;
            _this2.toleranceReached = false;
            _this2.lastDirection = null;
            _this2.dragging = false;
            _this2.el.isDragging = false;

            _this2.el.classList.remove("dragging");

            _this2.slide.classList.remove("dragging-nav");

            _this2.dragContainer.style.transform = "";
            _this2.dragContainer.style.transition = "";
          }, 100);
        },
      },
      {
        key: "drag",
        value: function drag(e) {
          if (this.active) {
            e.preventDefault();
            this.slide.classList.add("dragging-nav");

            if (e.type === "touchmove") {
              this.currentX = e.touches[0].clientX - this.initialX;
              this.currentY = e.touches[0].clientY - this.initialY;
            } else {
              this.currentX = e.clientX - this.initialX;
              this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.el.isDragging = true;
            this.dragging = true;
            this.doSlideChange = false;
            this.doSlideClose = false;
            var currentXInt = Math.abs(this.currentX);
            var currentYInt = Math.abs(this.currentY);

            if (
              currentXInt > 0 &&
              currentXInt >= Math.abs(this.currentY) &&
              (!this.lastDirection || this.lastDirection == "x")
            ) {
              this.yOffset = 0;
              this.lastDirection = "x";
              this.setTranslate(this.dragContainer, this.currentX, 0);
              var doChange = this.shouldChange();

              if (!this.instance.settings.dragAutoSnap && doChange) {
                this.doSlideChange = doChange;
              }

              if (this.instance.settings.dragAutoSnap && doChange) {
                this.instance.preventOutsideClick = true;
                this.toleranceReached = true;
                this.active = false;
                this.instance.preventOutsideClick = true;
                this.dragEnd(null);
                doChange == "right" && this.instance.prevSlide();
                doChange == "left" && this.instance.nextSlide();
                return;
              }
            }

            if (
              this.toleranceY > 0 &&
              currentYInt > 0 &&
              currentYInt >= currentXInt &&
              (!this.lastDirection || this.lastDirection == "y")
            ) {
              this.xOffset = 0;
              this.lastDirection = "y";
              this.setTranslate(this.dragContainer, 0, this.currentY);
              var doClose = this.shouldClose();

              if (!this.instance.settings.dragAutoSnap && doClose) {
                this.doSlideClose = true;
              }

              if (this.instance.settings.dragAutoSnap && doClose) {
                this.instance.close();
              }

              return;
            }
          }
        },
      },
      {
        key: "shouldChange",
        value: function shouldChange() {
          var doChange = false;
          var currentXInt = Math.abs(this.currentX);

          if (currentXInt >= this.toleranceX) {
            var dragDir = this.currentX > 0 ? "right" : "left";

            if (
              (dragDir == "left" &&
                this.slide !== this.slide.parentNode.lastChild) ||
              (dragDir == "right" &&
                this.slide !== this.slide.parentNode.firstChild)
            ) {
              doChange = dragDir;
            }
          }

          return doChange;
        },
      },
      {
        key: "shouldClose",
        value: function shouldClose() {
          var doClose = false;
          var currentYInt = Math.abs(this.currentY);

          if (currentYInt >= this.toleranceY) {
            doClose = true;
          }

          return doClose;
        },
      },
      {
        key: "setTranslate",
        value: function setTranslate(node, xPos, yPos) {
          var animated =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : false;

          if (animated) {
            node.style.transition = "all .2s ease";
          } else {
            node.style.transition = "";
          }

          node.style.transform = "translate3d("
            .concat(xPos, "px, ")
            .concat(yPos, "px, 0)");
        },
      },
    ]);

    return DragSlides;
  })();

  function slideImage(slide, data, index, callback) {
    var slideMedia = slide.querySelector(".gslide-media");
    var img = new Image();
    var titleID = "gSlideTitle_" + index;
    var textID = "gSlideDesc_" + index;
    img.addEventListener(
      "load",
      function () {
        if (isFunction(callback)) {
          callback();
        }
      },
      false
    );
    img.src = data.href;

    if (data.sizes != "" && data.srcset != "") {
      img.sizes = data.sizes;
      img.srcset = data.srcset;
    }

    img.alt = "";

    if (!isNil(data.alt) && data.alt !== "") {
      img.alt = data.alt;
    }

    if (data.title !== "") {
      img.setAttribute("aria-labelledby", titleID);
    }

    if (data.description !== "") {
      img.setAttribute("aria-describedby", textID);
    }

    if (data.hasOwnProperty("_hasCustomWidth") && data._hasCustomWidth) {
      img.style.width = data.width;
    }

    if (data.hasOwnProperty("_hasCustomHeight") && data._hasCustomHeight) {
      img.style.height = data.height;
    }

    slideMedia.insertBefore(img, slideMedia.firstChild);
    return;
  }

  function slideVideo(slide, data, index, callback) {
    var _this = this;

    var slideContainer = slide.querySelector(".ginner-container");
    var videoID = "gvideo" + index;
    var slideMedia = slide.querySelector(".gslide-media");
    var videoPlayers = this.getAllPlayers();
    addClass(slideContainer, "gvideo-container");
    slideMedia.insertBefore(
      createHTML('<div class="gvideo-wrapper"></div>'),
      slideMedia.firstChild
    );
    var videoWrapper = slide.querySelector(".gvideo-wrapper");
    injectAssets(this.settings.plyr.css, "Plyr");
    var url = data.href;
    var protocol = location.protocol.replace(":", "");
    var videoSource = "";
    var embedID = "";
    var customPlaceholder = false;

    if (protocol == "file") {
      protocol = "http";
    }

    slideMedia.style.maxWidth = data.width;
    injectAssets(this.settings.plyr.js, "Plyr", function () {
      if (url.match(/vimeo\.com\/([0-9]*)/)) {
        var vimeoID = /vimeo.*\/(\d+)/i.exec(url);
        videoSource = "vimeo";
        embedID = vimeoID[1];
      }

      if (
        url.match(
          /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/
        ) ||
        url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) ||
        url.match(
          /(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/
        )
      ) {
        var youtubeID = getYoutubeID(url);
        videoSource = "youtube";
        embedID = youtubeID;
      }

      if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
        videoSource = "local";
        var html = '<video id="' + videoID + '" ';
        html += 'style="background:#000; max-width: '.concat(data.width, ';" ');
        html += 'preload="metadata" ';
        html += 'x-webkit-airplay="allow" ';
        html += "playsinline ";
        html += "controls ";
        html += 'class="gvideo-local">';
        var format = url.toLowerCase().split(".").pop();
        var sources = {
          mp4: "",
          ogg: "",
          webm: "",
        };
        format = format == "mov" ? "mp4" : format;
        sources[format] = url;

        for (var key in sources) {
          if (sources.hasOwnProperty(key)) {
            var videoFile = sources[key];

            if (data.hasOwnProperty(key)) {
              videoFile = data[key];
            }

            if (videoFile !== "") {
              html += '<source src="'
                .concat(videoFile, '" type="video/')
                .concat(key, '">');
            }
          }
        }

        html += "</video>";
        customPlaceholder = createHTML(html);
      }

      var placeholder = customPlaceholder
        ? customPlaceholder
        : createHTML(
            '<div id="'
              .concat(videoID, '" data-plyr-provider="')
              .concat(videoSource, '" data-plyr-embed-id="')
              .concat(embedID, '"></div>')
          );
      addClass(videoWrapper, "".concat(videoSource, "-video gvideo"));
      videoWrapper.appendChild(placeholder);
      videoWrapper.setAttribute("data-id", videoID);
      videoWrapper.setAttribute("data-index", index);
      var playerConfig = has(_this.settings.plyr, "config")
        ? _this.settings.plyr.config
        : {};
      var player = new Plyr("#" + videoID, playerConfig);
      player.on("ready", function (event) {
        var instance = event.detail.plyr;
        videoPlayers[videoID] = instance;

        if (isFunction(callback)) {
          callback();
        }
      });
      waitUntil(
        function () {
          return (
            slide.querySelector("iframe") &&
            slide.querySelector("iframe").dataset.ready == "true"
          );
        },
        function () {
          _this.resize(slide);
        }
      );
      player.on("enterfullscreen", handleMediaFullScreen);
      player.on("exitfullscreen", handleMediaFullScreen);
    });
  }

  function getYoutubeID(url) {
    var videoID = "";
    url = url
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] !== undefined) {
      videoID = url[2].split(/[^0-9a-z_\-]/i);
      videoID = videoID[0];
    } else {
      videoID = url;
    }

    return videoID;
  }

  function handleMediaFullScreen(event) {
    var media = closest(event.target, ".gslide-media");

    if (event.type == "enterfullscreen") {
      addClass(media, "fullscreen");
    }

    if (event.type == "exitfullscreen") {
      removeClass(media, "fullscreen");
    }
  }

  function slideInline(slide, data, index, callback) {
    var _this = this;

    var slideMedia = slide.querySelector(".gslide-media");
    var hash =
      has(data, "href") && data.href
        ? data.href.split("#").pop().trim()
        : false;
    var content = has(data, "content") && data.content ? data.content : false;
    var innerContent;

    if (content) {
      if (isString(content)) {
        innerContent = createHTML(
          '<div class="ginlined-content">'.concat(content, "</div>")
        );
      }

      if (isNode(content)) {
        if (content.style.display == "none") {
          content.style.display = "block";
        }

        var container = document.createElement("div");
        container.className = "ginlined-content";
        container.appendChild(content);
        innerContent = container;
      }
    }

    if (hash) {
      var div = document.getElementById(hash);

      if (!div) {
        return false;
      }

      var cloned = div.cloneNode(true);
      cloned.style.height = data.height;
      cloned.style.maxWidth = data.width;
      addClass(cloned, "ginlined-content");
      innerContent = cloned;
    }

    if (!innerContent) {
      console.error("Unable to append inline slide content", data);
      return false;
    }

    slideMedia.style.height = data.height;
    slideMedia.style.width = data.width;
    slideMedia.appendChild(innerContent);
    this.events["inlineclose" + hash] = addEvent("click", {
      onElement: slideMedia.querySelectorAll(".gtrigger-close"),
      withCallback: function withCallback(e) {
        e.preventDefault();

        _this.close();
      },
    });

    if (isFunction(callback)) {
      callback();
    }

    return;
  }

  function slideIframe(slide, data, index, callback) {
    var slideMedia = slide.querySelector(".gslide-media");
    var iframe = createIframe({
      url: data.href,
      callback: callback,
    });
    slideMedia.parentNode.style.maxWidth = data.width;
    slideMedia.parentNode.style.height = data.height;
    slideMedia.appendChild(iframe);
    return;
  }

  var SlideConfigParser = (function () {
    function SlideConfigParser() {
      var slideParamas =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SlideConfigParser);

      this.defaults = {
        href: "",
        sizes: "",
        srcset: "",
        title: "",
        type: "",
        description: "",
        alt: "",
        descPosition: "bottom",
        effect: "",
        width: "",
        height: "",
        content: false,
        zoomable: true,
        draggable: true,
      };

      if (isObject(slideParamas)) {
        this.defaults = extend(this.defaults, slideParamas);
      }
    }

    _createClass(SlideConfigParser, [
      {
        key: "sourceType",
        value: function sourceType(url) {
          var origin = url;
          url = url.toLowerCase();

          if (
            url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null
          ) {
            return "image";
          }

          if (
            url.match(
              /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/
            ) ||
            url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) ||
            url.match(
              /(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/
            )
          ) {
            return "video";
          }

          if (url.match(/vimeo\.com\/([0-9]*)/)) {
            return "video";
          }

          if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
            return "video";
          }

          if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
            return "audio";
          }

          if (url.indexOf("#") > -1) {
            var hash = origin.split("#").pop();

            if (hash.trim() !== "") {
              return "inline";
            }
          }

          if (url.indexOf("goajax=true") > -1) {
            return "ajax";
          }

          return "external";
        },
      },
      {
        key: "parseConfig",
        value: function parseConfig(element, settings) {
          var _this = this;

          var data = extend(
            {
              descPosition: settings.descPosition,
            },
            this.defaults
          );

          if (isObject(element) && !isNode(element)) {
            if (!has(element, "type")) {
              if (has(element, "content") && element.content) {
                element.type = "inline";
              } else if (has(element, "href")) {
                element.type = this.sourceType(element.href);
              }
            }

            var objectData = extend(data, element);
            this.setSize(objectData, settings);
            return objectData;
          }

          var url = "";
          var config = element.getAttribute("data-glightbox");
          var nodeType = element.nodeName.toLowerCase();

          if (nodeType === "a") {
            url = element.href;
          }

          if (nodeType === "img") {
            url = element.src;
            data.alt = element.alt;
          }

          data.href = url;
          each(data, function (val, key) {
            if (has(settings, key) && key !== "width") {
              data[key] = settings[key];
            }

            var nodeData = element.dataset[key];

            if (!isNil(nodeData)) {
              data[key] = _this.sanitizeValue(nodeData);
            }
          });

          if (data.content) {
            data.type = "inline";
          }

          if (!data.type && url) {
            data.type = this.sourceType(url);
          }

          if (!isNil(config)) {
            var cleanKeys = [];
            each(data, function (v, k) {
              cleanKeys.push(";\\s?" + k);
            });
            cleanKeys = cleanKeys.join("\\s?:|");

            if (config.trim() !== "") {
              each(data, function (val, key) {
                var str = config;
                var match = "s?" + key + "s?:s?(.*?)(" + cleanKeys + "s?:|$)";
                var regex = new RegExp(match);
                var matches = str.match(regex);

                if (matches && matches.length && matches[1]) {
                  var value = matches[1].trim().replace(/;\s*$/, "");
                  data[key] = _this.sanitizeValue(value);
                }
              });
            }
          } else {
            if (!data.title && nodeType == "a") {
              var title = element.title;

              if (!isNil(title) && title !== "") {
                data.title = title;
              }
            }

            if (!data.title && nodeType == "img") {
              var alt = element.alt;

              if (!isNil(alt) && alt !== "") {
                data.title = alt;
              }
            }
          }

          if (data.description && data.description.substring(0, 1) === ".") {
            var description;

            try {
              description = document.querySelector(data.description).innerHTML;
            } catch (error) {
              if (!(error instanceof DOMException)) {
                throw error;
              }
            }

            if (description) {
              data.description = description;
            }
          }

          if (!data.description) {
            var nodeDesc = element.querySelector(".glightbox-desc");

            if (nodeDesc) {
              data.description = nodeDesc.innerHTML;
            }
          }

          this.setSize(data, settings, element);
          this.slideConfig = data;
          return data;
        },
      },
      {
        key: "setSize",
        value: function setSize(data, settings) {
          var element =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : null;
          var defaultWith =
            data.type == "video"
              ? this.checkSize(settings.videosWidth)
              : this.checkSize(settings.width);
          var defaultHeight = this.checkSize(settings.height);
          data.width =
            has(data, "width") && data.width !== ""
              ? this.checkSize(data.width)
              : defaultWith;
          data.height =
            has(data, "height") && data.height !== ""
              ? this.checkSize(data.height)
              : defaultHeight;

          if (element && data.type == "image") {
            data._hasCustomWidth = element.dataset.width ? true : false;
            data._hasCustomHeight = element.dataset.height ? true : false;
          }

          return data;
        },
      },
      {
        key: "checkSize",
        value: function checkSize(size) {
          return isNumber(size) ? "".concat(size, "px") : size;
        },
      },
      {
        key: "sanitizeValue",
        value: function sanitizeValue(val) {
          if (val !== "true" && val !== "false") {
            return val;
          }

          return val === "true";
        },
      },
    ]);

    return SlideConfigParser;
  })();

  var Slide = (function () {
    function Slide(el, instance, index) {
      _classCallCheck(this, Slide);

      this.element = el;
      this.instance = instance;
      this.index = index;
    }

    _createClass(Slide, [
      {
        key: "setContent",
        value: function setContent() {
          var _this = this;

          var slide =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;
          var callback =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;

          if (hasClass(slide, "loaded")) {
            return false;
          }

          var settings = this.instance.settings;
          var slideConfig = this.slideConfig;
          var isMobileDevice = isMobile();

          if (isFunction(settings.beforeSlideLoad)) {
            settings.beforeSlideLoad({
              index: this.index,
              slide: slide,
              player: false,
            });
          }

          var type = slideConfig.type;
          var position = slideConfig.descPosition;
          var slideMedia = slide.querySelector(".gslide-media");
          var slideTitle = slide.querySelector(".gslide-title");
          var slideText = slide.querySelector(".gslide-desc");
          var slideDesc = slide.querySelector(".gdesc-inner");
          var finalCallback = callback;
          var titleID = "gSlideTitle_" + this.index;
          var textID = "gSlideDesc_" + this.index;

          if (isFunction(settings.afterSlideLoad)) {
            finalCallback = function finalCallback() {
              if (isFunction(callback)) {
                callback();
              }

              settings.afterSlideLoad({
                index: _this.index,
                slide: slide,
                player: _this.instance.getSlidePlayerInstance(_this.index),
              });
            };
          }

          if (slideConfig.title == "" && slideConfig.description == "") {
            if (slideDesc) {
              slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
            }
          } else {
            if (slideTitle && slideConfig.title !== "") {
              slideTitle.id = titleID;
              slideTitle.innerHTML = slideConfig.title;
            } else {
              slideTitle.parentNode.removeChild(slideTitle);
            }

            if (slideText && slideConfig.description !== "") {
              slideText.id = textID;

              if (isMobileDevice && settings.moreLength > 0) {
                slideConfig.smallDescription = this.slideShortDesc(
                  slideConfig.description,
                  settings.moreLength,
                  settings.moreText
                );
                slideText.innerHTML = slideConfig.smallDescription;
                this.descriptionEvents(slideText, slideConfig);
              } else {
                slideText.innerHTML = slideConfig.description;
              }
            } else {
              slideText.parentNode.removeChild(slideText);
            }

            addClass(slideMedia.parentNode, "desc-".concat(position));
            addClass(slideDesc.parentNode, "description-".concat(position));
          }

          addClass(slideMedia, "gslide-".concat(type));
          addClass(slide, "loaded");

          if (type === "video") {
            slideVideo.apply(this.instance, [
              slide,
              slideConfig,
              this.index,
              finalCallback,
            ]);
            return;
          }

          if (type === "external") {
            slideIframe.apply(this, [
              slide,
              slideConfig,
              this.index,
              finalCallback,
            ]);
            return;
          }

          if (type === "inline") {
            slideInline.apply(this.instance, [
              slide,
              slideConfig,
              this.index,
              finalCallback,
            ]);

            if (slideConfig.draggable) {
              new DragSlides({
                dragEl: slide.querySelector(".gslide-inline"),
                toleranceX: settings.dragToleranceX,
                toleranceY: settings.dragToleranceY,
                slide: slide,
                instance: this.instance,
              });
            }

            return;
          }

          if (type === "image") {
            slideImage(slide, slideConfig, this.index, function () {
              var img = slide.querySelector("img");

              if (slideConfig.draggable) {
                new DragSlides({
                  dragEl: img,
                  toleranceX: settings.dragToleranceX,
                  toleranceY: settings.dragToleranceY,
                  slide: slide,
                  instance: _this.instance,
                });
              }

              if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
                addClass(img, "zoomable");
                new ZoomImages(img, slide, function () {
                  _this.instance.resize();
                });
              }

              if (isFunction(finalCallback)) {
                finalCallback();
              }
            });
            return;
          }

          if (isFunction(finalCallback)) {
            finalCallback();
          }
        },
      },
      {
        key: "slideShortDesc",
        value: function slideShortDesc(string) {
          var n =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 50;
          var wordBoundary =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : false;
          var div = document.createElement("div");
          div.innerHTML = string;
          var cleanedString = div.innerText;
          var useWordBoundary = wordBoundary;
          string = cleanedString.trim();

          if (string.length <= n) {
            return string;
          }

          var subString = string.substr(0, n - 1);

          if (!useWordBoundary) {
            return subString;
          }

          div = null;
          return (
            subString +
            '... <a href="#" class="desc-more">' +
            wordBoundary +
            "</a>"
          );
        },
      },
      {
        key: "descriptionEvents",
        value: function descriptionEvents(desc, data) {
          var _this2 = this;

          var moreLink = desc.querySelector(".desc-more");

          if (!moreLink) {
            return false;
          }

          addEvent("click", {
            onElement: moreLink,
            withCallback: function withCallback(event, target) {
              event.preventDefault();
              var body = document.body;
              var desc = closest(target, ".gslide-desc");

              if (!desc) {
                return false;
              }

              desc.innerHTML = data.description;
              addClass(body, "gdesc-open");
              var shortEvent = addEvent("click", {
                onElement: [body, closest(desc, ".gslide-description")],
                withCallback: function withCallback(event, target) {
                  if (event.target.nodeName.toLowerCase() !== "a") {
                    removeClass(body, "gdesc-open");
                    addClass(body, "gdesc-closed");
                    desc.innerHTML = data.smallDescription;

                    _this2.descriptionEvents(desc, data);

                    setTimeout(function () {
                      removeClass(body, "gdesc-closed");
                    }, 400);
                    shortEvent.destroy();
                  }
                },
              });
            },
          });
        },
      },
      {
        key: "create",
        value: function create() {
          return createHTML(this.instance.settings.slideHTML);
        },
      },
      {
        key: "getConfig",
        value: function getConfig() {
          if (
            !isNode(this.element) &&
            !this.element.hasOwnProperty("draggable")
          ) {
            this.element.draggable = this.instance.settings.draggable;
          }

          var parser = new SlideConfigParser(
            this.instance.settings.slideExtraAttributes
          );
          this.slideConfig = parser.parseConfig(
            this.element,
            this.instance.settings
          );
          return this.slideConfig;
        },
      },
    ]);

    return Slide;
  })();

  var _version = "3.1.1";

  var isMobile$1 = isMobile();

  var isTouch$1 = isTouch();

  var html = document.getElementsByTagName("html")[0];
  var defaults = {
    selector: ".glightbox",
    elements: null,
    skin: "clean",
    theme: "clean",
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
    autofocusVideos: true,
    descPosition: "bottom",
    width: "900px",
    height: "506px",
    videosWidth: "960px",
    beforeSlideChange: null,
    afterSlideChange: null,
    beforeSlideLoad: null,
    afterSlideLoad: null,
    slideInserted: null,
    slideRemoved: null,
    slideExtraAttributes: null,
    onOpen: null,
    onClose: null,
    loop: false,
    zoomable: true,
    draggable: true,
    dragAutoSnap: false,
    dragToleranceX: 40,
    dragToleranceY: 65,
    preload: true,
    oneSlidePerOpen: false,
    touchNavigation: true,
    touchFollowAxis: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plugins: false,
    plyr: {
      css: "https://cdn.plyr.io/3.6.8/plyr.css",
      js: "https://cdn.plyr.io/3.6.8/plyr.js",
      config: {
        ratio: "16:9",
        fullscreen: {
          enabled: true,
          iosNative: true,
        },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        vimeo: {
          byline: false,
          portrait: false,
          title: false,
          transparent: false,
        },
      },
    },
    openEffect: "zoom",
    closeEffect: "zoom",
    slideEffect: "slide",
    moreText: "See more",
    moreLength: 60,
    cssEfects: {
      fade: {
        in: "fadeIn",
        out: "fadeOut",
      },
      zoom: {
        in: "zoomIn",
        out: "zoomOut",
      },
      slide: {
        in: "slideInRight",
        out: "slideOutLeft",
      },
      slideBack: {
        in: "slideInLeft",
        out: "slideOutRight",
      },
      none: {
        in: "none",
        out: "none",
      },
    },
    svg: {
      close:
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
      next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
      prev: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>',
    },
  };
  defaults.slideHTML =
    '<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';
  defaults.lightboxHTML =
    '<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>\n    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>\n    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>\n</div>\n</div>';

  var GlightboxInit = (function () {
    function GlightboxInit() {
      var options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, GlightboxInit);

      this.customOptions = options;
      this.settings = extend(defaults, options);
      this.effectsClasses = this.getAnimationClasses();
      this.videoPlayers = {};
      this.apiEvents = [];
      this.fullElementsList = false;
    }

    _createClass(GlightboxInit, [
      {
        key: "init",
        value: function init() {
          var _this = this;

          var selector = this.getSelector();

          if (selector) {
            this.baseEvents = addEvent("click", {
              onElement: selector,
              withCallback: function withCallback(e, target) {
                e.preventDefault();

                _this.open(target);
              },
            });
          }

          this.elements = this.getElements();
        },
      },
      {
        key: "open",
        value: function open() {
          var element =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;
          var startAt =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : null;

          if (this.elements.length == 0) {
            return false;
          }

          this.activeSlide = null;
          this.prevActiveSlideIndex = null;
          this.prevActiveSlide = null;
          var index = isNumber(startAt) ? startAt : this.settings.startAt;

          if (isNode(element)) {
            var gallery = element.getAttribute("data-gallery");

            if (gallery) {
              this.fullElementsList = this.elements;
              this.elements = this.getGalleryElements(this.elements, gallery);
            }

            if (isNil(index)) {
              index = this.getElementIndex(element);

              if (index < 0) {
                index = 0;
              }
            }
          }

          if (!isNumber(index)) {
            index = 0;
          }

          this.build();

          animateElement(
            this.overlay,
            this.settings.openEffect == "none"
              ? "none"
              : this.settings.cssEfects.fade["in"]
          );

          var body = document.body;
          var scrollBar =
            window.innerWidth - document.documentElement.clientWidth;

          if (scrollBar > 0) {
            var styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.className = "gcss-styles";
            styleSheet.innerText = ".gscrollbar-fixer {margin-right: ".concat(
              scrollBar,
              "px}"
            );
            document.head.appendChild(styleSheet);

            addClass(body, "gscrollbar-fixer");
          }

          addClass(body, "glightbox-open");

          addClass(html, "glightbox-open");

          if (isMobile$1) {
            addClass(document.body, "glightbox-mobile");

            this.settings.slideEffect = "slide";
          }

          this.showSlide(index, true);

          if (this.elements.length == 1) {
            addClass(this.prevButton, "glightbox-button-hidden");

            addClass(this.nextButton, "glightbox-button-hidden");
          } else {
            removeClass(this.prevButton, "glightbox-button-hidden");

            removeClass(this.nextButton, "glightbox-button-hidden");
          }

          this.lightboxOpen = true;
          this.trigger("open");

          if (isFunction(this.settings.onOpen)) {
            this.settings.onOpen();
          }

          if (isTouch$1 && this.settings.touchNavigation) {
            touchNavigation(this);
          }

          if (this.settings.keyboardNavigation) {
            keyboardNavigation(this);
          }
        },
      },
      {
        key: "openAt",
        value: function openAt() {
          var index =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0;
          this.open(null, index);
        },
      },
      {
        key: "showSlide",
        value: function showSlide() {
          var _this2 = this;

          var index =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0;
          var first =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;

          show(this.loader);

          this.index = parseInt(index);
          var current = this.slidesContainer.querySelector(".current");

          if (current) {
            removeClass(current, "current");
          }

          this.slideAnimateOut();
          var slideNode =
            this.slidesContainer.querySelectorAll(".gslide")[index];

          if (hasClass(slideNode, "loaded")) {
            this.slideAnimateIn(slideNode, first);

            hide(this.loader);
          } else {
            show(this.loader);

            var slide = this.elements[index];
            var slideData = {
              index: this.index,
              slide: slideNode,
              slideNode: slideNode,
              slideConfig: slide.slideConfig,
              slideIndex: this.index,
              trigger: slide.node,
              player: null,
            };
            this.trigger("slide_before_load", slideData);
            slide.instance.setContent(slideNode, function () {
              hide(_this2.loader);

              _this2.resize();

              _this2.slideAnimateIn(slideNode, first);

              _this2.trigger("slide_after_load", slideData);
            });
          }

          this.slideDescription = slideNode.querySelector(
            ".gslide-description"
          );
          this.slideDescriptionContained =
            this.slideDescription &&
            hasClass(this.slideDescription.parentNode, "gslide-media");

          if (this.settings.preload) {
            this.preloadSlide(index + 1);
            this.preloadSlide(index - 1);
          }

          this.updateNavigationClasses();
          this.activeSlide = slideNode;
        },
      },
      {
        key: "preloadSlide",
        value: function preloadSlide(index) {
          var _this3 = this;

          if (index < 0 || index > this.elements.length - 1) {
            return false;
          }

          if (isNil(this.elements[index])) {
            return false;
          }

          var slideNode =
            this.slidesContainer.querySelectorAll(".gslide")[index];

          if (hasClass(slideNode, "loaded")) {
            return false;
          }

          var slide = this.elements[index];
          var type = slide.type;
          var slideData = {
            index: index,
            slide: slideNode,
            slideNode: slideNode,
            slideConfig: slide.slideConfig,
            slideIndex: index,
            trigger: slide.node,
            player: null,
          };
          this.trigger("slide_before_load", slideData);

          if (type == "video" || type == "external") {
            setTimeout(function () {
              slide.instance.setContent(slideNode, function () {
                _this3.trigger("slide_after_load", slideData);
              });
            }, 200);
          } else {
            slide.instance.setContent(slideNode, function () {
              _this3.trigger("slide_after_load", slideData);
            });
          }
        },
      },
      {
        key: "prevSlide",
        value: function prevSlide() {
          this.goToSlide(this.index - 1);
        },
      },
      {
        key: "nextSlide",
        value: function nextSlide() {
          this.goToSlide(this.index + 1);
        },
      },
      {
        key: "goToSlide",
        value: function goToSlide() {
          var index =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : false;
          this.prevActiveSlide = this.activeSlide;
          this.prevActiveSlideIndex = this.index;

          if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
            return false;
          }

          if (index < 0) {
            index = this.elements.length - 1;
          } else if (index >= this.elements.length) {
            index = 0;
          }

          this.showSlide(index);
        },
      },
      {
        key: "insertSlide",
        value: function insertSlide() {
          var config =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};
          var index =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : -1;

          if (index < 0) {
            index = this.elements.length;
          }

          var slide = new Slide(config, this, index);
          var data = slide.getConfig();

          var slideInfo = extend({}, data);

          var newSlide = slide.create();
          var totalSlides = this.elements.length - 1;
          slideInfo.index = index;
          slideInfo.node = false;
          slideInfo.instance = slide;
          slideInfo.slideConfig = data;
          this.elements.splice(index, 0, slideInfo);
          var addedSlideNode = null;
          var addedSlidePlayer = null;

          if (this.slidesContainer) {
            if (index > totalSlides) {
              this.slidesContainer.appendChild(newSlide);
            } else {
              var existingSlide =
                this.slidesContainer.querySelectorAll(".gslide")[index];
              this.slidesContainer.insertBefore(newSlide, existingSlide);
            }

            if (
              (this.settings.preload && this.index == 0 && index == 0) ||
              this.index - 1 == index ||
              this.index + 1 == index
            ) {
              this.preloadSlide(index);
            }

            if (this.index == 0 && index == 0) {
              this.index = 1;
            }

            this.updateNavigationClasses();
            addedSlideNode =
              this.slidesContainer.querySelectorAll(".gslide")[index];
            addedSlidePlayer = this.getSlidePlayerInstance(index);
            slideInfo.slideNode = addedSlideNode;
          }

          this.trigger("slide_inserted", {
            index: index,
            slide: addedSlideNode,
            slideNode: addedSlideNode,
            slideConfig: data,
            slideIndex: index,
            trigger: null,
            player: addedSlidePlayer,
          });

          if (isFunction(this.settings.slideInserted)) {
            this.settings.slideInserted({
              index: index,
              slide: addedSlideNode,
              player: addedSlidePlayer,
            });
          }
        },
      },
      {
        key: "removeSlide",
        value: function removeSlide() {
          var index =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : -1;

          if (index < 0 || index > this.elements.length - 1) {
            return false;
          }

          var slide =
            this.slidesContainer &&
            this.slidesContainer.querySelectorAll(".gslide")[index];

          if (slide) {
            if (this.getActiveSlideIndex() == index) {
              if (index == this.elements.length - 1) {
                this.prevSlide();
              } else {
                this.nextSlide();
              }
            }

            slide.parentNode.removeChild(slide);
          }

          this.elements.splice(index, 1);
          this.trigger("slide_removed", index);

          if (isFunction(this.settings.slideRemoved)) {
            this.settings.slideRemoved(index);
          }
        },
      },
      {
        key: "slideAnimateIn",
        value: function slideAnimateIn(slide, first) {
          var _this4 = this;

          var slideMedia = slide.querySelector(".gslide-media");
          var slideDesc = slide.querySelector(".gslide-description");
          var prevData = {
            index: this.prevActiveSlideIndex,
            slide: this.prevActiveSlide,
            slideNode: this.prevActiveSlide,
            slideIndex: this.prevActiveSlide,
            slideConfig: isNil(this.prevActiveSlideIndex)
              ? null
              : this.elements[this.prevActiveSlideIndex].slideConfig,
            trigger: isNil(this.prevActiveSlideIndex)
              ? null
              : this.elements[this.prevActiveSlideIndex].node,
            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex),
          };
          var nextData = {
            index: this.index,
            slide: this.activeSlide,
            slideNode: this.activeSlide,
            slideConfig: this.elements[this.index].slideConfig,
            slideIndex: this.index,
            trigger: this.elements[this.index].node,
            player: this.getSlidePlayerInstance(this.index),
          };

          if (slideMedia.offsetWidth > 0 && slideDesc) {
            hide(slideDesc);

            slideDesc.style.display = "";
          }

          removeClass(slide, this.effectsClasses);

          if (first) {
            animateElement(
              slide,
              this.settings.cssEfects[this.settings.openEffect]["in"],
              function () {
                if (_this4.settings.autoplayVideos) {
                  _this4.slidePlayerPlay(slide);
                }

                _this4.trigger("slide_changed", {
                  prev: prevData,
                  current: nextData,
                });

                if (isFunction(_this4.settings.afterSlideChange)) {
                  _this4.settings.afterSlideChange.apply(_this4, [
                    prevData,
                    nextData,
                  ]);
                }
              }
            );
          } else {
            var effectName = this.settings.slideEffect;
            var animIn =
              effectName !== "none"
                ? this.settings.cssEfects[effectName]["in"]
                : effectName;

            if (this.prevActiveSlideIndex > this.index) {
              if (this.settings.slideEffect == "slide") {
                animIn = this.settings.cssEfects.slideBack["in"];
              }
            }

            animateElement(slide, animIn, function () {
              if (_this4.settings.autoplayVideos) {
                _this4.slidePlayerPlay(slide);
              }

              _this4.trigger("slide_changed", {
                prev: prevData,
                current: nextData,
              });

              if (isFunction(_this4.settings.afterSlideChange)) {
                _this4.settings.afterSlideChange.apply(_this4, [
                  prevData,
                  nextData,
                ]);
              }
            });
          }

          setTimeout(function () {
            _this4.resize(slide);
          }, 100);

          addClass(slide, "current");
        },
      },
      {
        key: "slideAnimateOut",
        value: function slideAnimateOut() {
          if (!this.prevActiveSlide) {
            return false;
          }

          var prevSlide = this.prevActiveSlide;

          removeClass(prevSlide, this.effectsClasses);

          addClass(prevSlide, "prev");

          var animation = this.settings.slideEffect;
          var animOut =
            animation !== "none"
              ? this.settings.cssEfects[animation].out
              : animation;
          this.slidePlayerPause(prevSlide);
          this.trigger("slide_before_change", {
            prev: {
              index: this.prevActiveSlideIndex,
              slide: this.prevActiveSlide,
              slideNode: this.prevActiveSlide,
              slideIndex: this.prevActiveSlideIndex,
              slideConfig: isNil(this.prevActiveSlideIndex)
                ? null
                : this.elements[this.prevActiveSlideIndex].slideConfig,
              trigger: isNil(this.prevActiveSlideIndex)
                ? null
                : this.elements[this.prevActiveSlideIndex].node,
              player: this.getSlidePlayerInstance(this.prevActiveSlideIndex),
            },
            current: {
              index: this.index,
              slide: this.activeSlide,
              slideNode: this.activeSlide,
              slideIndex: this.index,
              slideConfig: this.elements[this.index].slideConfig,
              trigger: this.elements[this.index].node,
              player: this.getSlidePlayerInstance(this.index),
            },
          });

          if (isFunction(this.settings.beforeSlideChange)) {
            this.settings.beforeSlideChange.apply(this, [
              {
                index: this.prevActiveSlideIndex,
                slide: this.prevActiveSlide,
                player: this.getSlidePlayerInstance(this.prevActiveSlideIndex),
              },
              {
                index: this.index,
                slide: this.activeSlide,
                player: this.getSlidePlayerInstance(this.index),
              },
            ]);
          }

          if (
            this.prevActiveSlideIndex > this.index &&
            this.settings.slideEffect == "slide"
          ) {
            animOut = this.settings.cssEfects.slideBack.out;
          }

          animateElement(prevSlide, animOut, function () {
            var container = prevSlide.querySelector(".ginner-container");
            var media = prevSlide.querySelector(".gslide-media");
            var desc = prevSlide.querySelector(".gslide-description");
            container.style.transform = "";
            media.style.transform = "";

            removeClass(media, "greset");

            media.style.opacity = "";

            if (desc) {
              desc.style.opacity = "";
            }

            removeClass(prevSlide, "prev");
          });
        },
      },
      {
        key: "getAllPlayers",
        value: function getAllPlayers() {
          return this.videoPlayers;
        },
      },
      {
        key: "getSlidePlayerInstance",
        value: function getSlidePlayerInstance(index) {
          var id = "gvideo" + index;
          var videoPlayers = this.getAllPlayers();

          if (has(videoPlayers, id) && videoPlayers[id]) {
            return videoPlayers[id];
          }

          return false;
        },
      },
      {
        key: "stopSlideVideo",
        value: function stopSlideVideo(slide) {
          if (isNode(slide)) {
            var node = slide.querySelector(".gvideo-wrapper");

            if (node) {
              slide = node.getAttribute("data-index");
            }
          }

          console.log("stopSlideVideo is deprecated, use slidePlayerPause");
          var player = this.getSlidePlayerInstance(slide);

          if (player && player.playing) {
            player.pause();
          }
        },
      },
      {
        key: "slidePlayerPause",
        value: function slidePlayerPause(slide) {
          if (isNode(slide)) {
            var node = slide.querySelector(".gvideo-wrapper");

            if (node) {
              slide = node.getAttribute("data-index");
            }
          }

          var player = this.getSlidePlayerInstance(slide);

          if (player && player.playing) {
            player.pause();
          }
        },
      },
      {
        key: "playSlideVideo",
        value: function playSlideVideo(slide) {
          if (isNode(slide)) {
            var node = slide.querySelector(".gvideo-wrapper");

            if (node) {
              slide = node.getAttribute("data-index");
            }
          }

          console.log("playSlideVideo is deprecated, use slidePlayerPlay");
          var player = this.getSlidePlayerInstance(slide);

          if (player && !player.playing) {
            player.play();
          }
        },
      },
      {
        key: "slidePlayerPlay",
        value: function slidePlayerPlay(slide) {
          if (isNode(slide)) {
            var node = slide.querySelector(".gvideo-wrapper");

            if (node) {
              slide = node.getAttribute("data-index");
            }
          }

          var player = this.getSlidePlayerInstance(slide);

          if (player && !player.playing) {
            player.play();

            if (this.settings.autofocusVideos) {
              player.elements.container.focus();
            }
          }
        },
      },
      {
        key: "setElements",
        value: function setElements(elements) {
          var _this5 = this;

          this.settings.elements = false;
          var newElements = [];

          if (elements && elements.length) {
            each(elements, function (el, i) {
              var slide = new Slide(el, _this5, i);
              var data = slide.getConfig();

              var slideInfo = extend({}, data);

              slideInfo.slideConfig = data;
              slideInfo.instance = slide;
              slideInfo.index = i;
              newElements.push(slideInfo);
            });
          }

          this.elements = newElements;

          if (this.lightboxOpen) {
            this.slidesContainer.innerHTML = "";

            if (this.elements.length) {
              each(this.elements, function () {
                var slide = createHTML(_this5.settings.slideHTML);

                _this5.slidesContainer.appendChild(slide);
              });

              this.showSlide(0, true);
            }
          }
        },
      },
      {
        key: "getElementIndex",
        value: function getElementIndex(node) {
          var index = false;

          each(this.elements, function (el, i) {
            if (has(el, "node") && el.node == node) {
              index = i;
              return true;
            }
          });

          return index;
        },
      },
      {
        key: "getElements",
        value: function getElements() {
          var _this6 = this;

          var list = [];
          this.elements = this.elements ? this.elements : [];

          if (
            !isNil(this.settings.elements) &&
            isArray(this.settings.elements) &&
            this.settings.elements.length
          ) {
            each(this.settings.elements, function (el, i) {
              var slide = new Slide(el, _this6, i);
              var elData = slide.getConfig();

              var slideInfo = extend({}, elData);

              slideInfo.node = false;
              slideInfo.index = i;
              slideInfo.instance = slide;
              slideInfo.slideConfig = elData;
              list.push(slideInfo);
            });
          }

          var nodes = false;
          var selector = this.getSelector();

          if (selector) {
            nodes = document.querySelectorAll(this.getSelector());
          }

          if (!nodes) {
            return list;
          }

          each(nodes, function (el, i) {
            var slide = new Slide(el, _this6, i);
            var elData = slide.getConfig();

            var slideInfo = extend({}, elData);

            slideInfo.node = el;
            slideInfo.index = i;
            slideInfo.instance = slide;
            slideInfo.slideConfig = elData;
            slideInfo.gallery = el.getAttribute("data-gallery");
            list.push(slideInfo);
          });

          return list;
        },
      },
      {
        key: "getGalleryElements",
        value: function getGalleryElements(list, gallery) {
          return list.filter(function (el) {
            return el.gallery == gallery;
          });
        },
      },
      {
        key: "getSelector",
        value: function getSelector() {
          if (this.settings.elements) {
            return false;
          }

          if (
            this.settings.selector &&
            this.settings.selector.substring(0, 5) == "data-"
          ) {
            return "*[".concat(this.settings.selector, "]");
          }

          return this.settings.selector;
        },
      },
      {
        key: "getActiveSlide",
        value: function getActiveSlide() {
          return this.slidesContainer.querySelectorAll(".gslide")[this.index];
        },
      },
      {
        key: "getActiveSlideIndex",
        value: function getActiveSlideIndex() {
          return this.index;
        },
      },
      {
        key: "getAnimationClasses",
        value: function getAnimationClasses() {
          var effects = [];

          for (var key in this.settings.cssEfects) {
            if (this.settings.cssEfects.hasOwnProperty(key)) {
              var effect = this.settings.cssEfects[key];
              effects.push("g".concat(effect["in"]));
              effects.push("g".concat(effect.out));
            }
          }

          return effects.join(" ");
        },
      },
      {
        key: "build",
        value: function build() {
          var _this7 = this;

          if (this.built) {
            return false;
          }

          var children = document.body.childNodes;
          var bodyChildElms = [];

          each(children, function (el) {
            if (
              el.parentNode == document.body &&
              el.nodeName.charAt(0) !== "#" &&
              el.hasAttribute &&
              !el.hasAttribute("aria-hidden")
            ) {
              bodyChildElms.push(el);
              el.setAttribute("aria-hidden", "true");
            }
          });

          var nextSVG = has(this.settings.svg, "next")
            ? this.settings.svg.next
            : "";
          var prevSVG = has(this.settings.svg, "prev")
            ? this.settings.svg.prev
            : "";
          var closeSVG = has(this.settings.svg, "close")
            ? this.settings.svg.close
            : "";
          var lightboxHTML = this.settings.lightboxHTML;
          lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
          lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
          lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);
          lightboxHTML = createHTML(lightboxHTML);
          document.body.appendChild(lightboxHTML);
          var modal = document.getElementById("glightbox-body");
          this.modal = modal;
          var closeButton = modal.querySelector(".gclose");
          this.prevButton = modal.querySelector(".gprev");
          this.nextButton = modal.querySelector(".gnext");
          this.overlay = modal.querySelector(".goverlay");
          this.loader = modal.querySelector(".gloader");
          this.slidesContainer = document.getElementById("glightbox-slider");
          this.bodyHiddenChildElms = bodyChildElms;
          this.events = {};

          addClass(this.modal, "glightbox-" + this.settings.skin);

          if (this.settings.closeButton && closeButton) {
            this.events["close"] = addEvent("click", {
              onElement: closeButton,
              withCallback: function withCallback(e, target) {
                e.preventDefault();

                _this7.close();
              },
            });
          }

          if (closeButton && !this.settings.closeButton) {
            closeButton.parentNode.removeChild(closeButton);
          }

          if (this.nextButton) {
            this.events["next"] = addEvent("click", {
              onElement: this.nextButton,
              withCallback: function withCallback(e, target) {
                e.preventDefault();

                _this7.nextSlide();
              },
            });
          }

          if (this.prevButton) {
            this.events["prev"] = addEvent("click", {
              onElement: this.prevButton,
              withCallback: function withCallback(e, target) {
                e.preventDefault();

                _this7.prevSlide();
              },
            });
          }

          if (this.settings.closeOnOutsideClick) {
            this.events["outClose"] = addEvent("click", {
              onElement: modal,
              withCallback: function withCallback(e, target) {
                if (
                  !_this7.preventOutsideClick &&
                  !hasClass(document.body, "glightbox-mobile") &&
                  !closest(e.target, ".ginner-container")
                ) {
                  if (
                    !closest(e.target, ".gbtn") &&
                    !hasClass(e.target, "gnext") &&
                    !hasClass(e.target, "gprev")
                  ) {
                    _this7.close();
                  }
                }
              },
            });
          }

          each(this.elements, function (slide, i) {
            _this7.slidesContainer.appendChild(slide.instance.create());

            slide.slideNode =
              _this7.slidesContainer.querySelectorAll(".gslide")[i];
          });

          if (isTouch$1) {
            addClass(document.body, "glightbox-touch");
          }

          this.events["resize"] = addEvent("resize", {
            onElement: window,
            withCallback: function withCallback() {
              _this7.resize();
            },
          });
          this.built = true;
        },
      },
      {
        key: "resize",
        value: function resize() {
          var slide =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;
          slide = !slide ? this.activeSlide : slide;

          if (!slide || hasClass(slide, "zoomed")) {
            return;
          }

          var winSize = windowSize();

          var video = slide.querySelector(".gvideo-wrapper");
          var image = slide.querySelector(".gslide-image");
          var description = this.slideDescription;
          var winWidth = winSize.width;
          var winHeight = winSize.height;

          if (winWidth <= 768) {
            addClass(document.body, "glightbox-mobile");
          } else {
            removeClass(document.body, "glightbox-mobile");
          }

          if (!video && !image) {
            return;
          }

          var descriptionResize = false;

          if (
            description &&
            (hasClass(description, "description-bottom") ||
              hasClass(description, "description-top")) &&
            !hasClass(description, "gabsolute")
          ) {
            descriptionResize = true;
          }

          if (image) {
            if (winWidth <= 768) {
              var imgNode = image.querySelector("img");
            } else if (descriptionResize) {
              var descHeight = description.offsetHeight;

              var _imgNode = image.querySelector("img");

              _imgNode.setAttribute(
                "style",
                "max-height: calc(100vh - ".concat(descHeight, "px)")
              );

              description.setAttribute(
                "style",
                "max-width: ".concat(_imgNode.offsetWidth, "px;")
              );
            }
          }

          if (video) {
            var ratio = has(this.settings.plyr.config, "ratio")
              ? this.settings.plyr.config.ratio
              : "";

            if (!ratio) {
              var containerWidth = video.clientWidth;
              var containerHeight = video.clientHeight;
              var divisor = containerWidth / containerHeight;
              ratio = ""
                .concat(containerWidth / divisor, ":")
                .concat(containerHeight / divisor);
            }

            var videoRatio = ratio.split(":");
            var videoWidth = this.settings.videosWidth;
            var maxWidth = this.settings.videosWidth;

            if (isNumber(videoWidth) || videoWidth.indexOf("px") !== -1) {
              maxWidth = parseInt(videoWidth);
            } else {
              if (videoWidth.indexOf("vw") !== -1) {
                maxWidth = (winWidth * parseInt(videoWidth)) / 100;
              } else if (videoWidth.indexOf("vh") !== -1) {
                maxWidth = (winHeight * parseInt(videoWidth)) / 100;
              } else if (videoWidth.indexOf("%") !== -1) {
                maxWidth = (winWidth * parseInt(videoWidth)) / 100;
              } else {
                maxWidth = parseInt(video.clientWidth);
              }
            }

            var maxHeight =
              maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
            maxHeight = Math.floor(maxHeight);

            if (descriptionResize) {
              winHeight = winHeight - description.offsetHeight;
            }

            if (
              maxWidth > winWidth ||
              maxHeight > winHeight ||
              (winHeight < maxHeight && winWidth > maxWidth)
            ) {
              var vwidth = video.offsetWidth;
              var vheight = video.offsetHeight;

              var _ratio = winHeight / vheight;

              var vsize = {
                width: vwidth * _ratio,
                height: vheight * _ratio,
              };
              video.parentNode.setAttribute(
                "style",
                "max-width: ".concat(vsize.width, "px")
              );

              if (descriptionResize) {
                description.setAttribute(
                  "style",
                  "max-width: ".concat(vsize.width, "px;")
                );
              }
            } else {
              video.parentNode.style.maxWidth = "".concat(videoWidth);

              if (descriptionResize) {
                description.setAttribute(
                  "style",
                  "max-width: ".concat(videoWidth, ";")
                );
              }
            }
          }
        },
      },
      {
        key: "reload",
        value: function reload() {
          this.init();
        },
      },
      {
        key: "updateNavigationClasses",
        value: function updateNavigationClasses() {
          var loop = this.loop();

          removeClass(this.nextButton, "disabled");

          removeClass(this.prevButton, "disabled");

          if (this.index == 0 && this.elements.length - 1 == 0) {
            addClass(this.prevButton, "disabled");

            addClass(this.nextButton, "disabled");
          } else if (this.index === 0 && !loop) {
            addClass(this.prevButton, "disabled");
          } else if (this.index === this.elements.length - 1 && !loop) {
            addClass(this.nextButton, "disabled");
          }
        },
      },
      {
        key: "loop",
        value: function loop() {
          var loop = has(this.settings, "loopAtEnd")
            ? this.settings.loopAtEnd
            : null;
          loop = has(this.settings, "loop") ? this.settings.loop : loop;
          return loop;
        },
      },
      {
        key: "close",
        value: function close() {
          var _this8 = this;

          if (!this.lightboxOpen) {
            if (this.events) {
              for (var key in this.events) {
                if (this.events.hasOwnProperty(key)) {
                  this.events[key].destroy();
                }
              }

              this.events = null;
            }

            return false;
          }

          if (this.closing) {
            return false;
          }

          this.closing = true;
          this.slidePlayerPause(this.activeSlide);

          if (this.fullElementsList) {
            this.elements = this.fullElementsList;
          }

          if (this.bodyHiddenChildElms.length) {
            each(this.bodyHiddenChildElms, function (el) {
              el.removeAttribute("aria-hidden");
            });
          }

          addClass(this.modal, "glightbox-closing");

          animateElement(
            this.overlay,
            this.settings.openEffect == "none"
              ? "none"
              : this.settings.cssEfects.fade.out
          );

          animateElement(
            this.activeSlide,
            this.settings.cssEfects[this.settings.closeEffect].out,
            function () {
              _this8.activeSlide = null;
              _this8.prevActiveSlideIndex = null;
              _this8.prevActiveSlide = null;
              _this8.built = false;

              if (_this8.events) {
                for (var _key in _this8.events) {
                  if (_this8.events.hasOwnProperty(_key)) {
                    _this8.events[_key].destroy();
                  }
                }

                _this8.events = null;
              }

              var body = document.body;

              removeClass(html, "glightbox-open");

              removeClass(
                body,
                "glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer"
              );

              _this8.modal.parentNode.removeChild(_this8.modal);

              _this8.trigger("close");

              if (isFunction(_this8.settings.onClose)) {
                _this8.settings.onClose();
              }

              var styles = document.querySelector(".gcss-styles");

              if (styles) {
                styles.parentNode.removeChild(styles);
              }

              _this8.lightboxOpen = false;
              _this8.closing = null;
            }
          );
        },
      },
      {
        key: "destroy",
        value: function destroy() {
          this.close();
          this.clearAllEvents();

          if (this.baseEvents) {
            this.baseEvents.destroy();
          }
        },
      },
      {
        key: "on",
        value: function on(evt, callback) {
          var once =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : false;

          if (!evt || !isFunction(callback)) {
            throw new TypeError("Event name and callback must be defined");
          }

          this.apiEvents.push({
            evt: evt,
            once: once,
            callback: callback,
          });
        },
      },
      {
        key: "once",
        value: function once(evt, callback) {
          this.on(evt, callback, true);
        },
      },
      {
        key: "trigger",
        value: function trigger(eventName) {
          var _this9 = this;

          var data =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : null;
          var onceTriggered = [];

          each(this.apiEvents, function (event, i) {
            var evt = event.evt,
              once = event.once,
              callback = event.callback;

            if (evt == eventName) {
              callback(data);

              if (once) {
                onceTriggered.push(i);
              }
            }
          });

          if (onceTriggered.length) {
            each(onceTriggered, function (i) {
              return _this9.apiEvents.splice(i, 1);
            });
          }
        },
      },
      {
        key: "clearAllEvents",
        value: function clearAllEvents() {
          this.apiEvents.splice(0, this.apiEvents.length);
        },
      },
      {
        key: "version",
        value: function version() {
          return _version;
        },
      },
    ]);

    return GlightboxInit;
  })();

  function glightbox() {
    var options =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instance = new GlightboxInit(options);
    instance.init();
    return instance;
  }

  return glightbox;
});

;
(function () {
  "use strict";
  // gallery init
  GLightbox();

  // justified gallery init
  window.setTimeout(() => {
    const justify_scale = screen.height * 0.25;
    let items = document.querySelectorAll(".gallery-item");
    Array.prototype.forEach.call(items, (item) => {
      let image = item.querySelector("img");
      let ratio = image.width / image.height;
      item.style.width = justify_scale * ratio + "px";
      item.style.flexGrow = ratio;
    });
  }, 200);

  // gallery slider
  var isGallerySlider = document.getElementsByClassName("gallery-slider");
  if (isGallerySlider.length > 0) {
    new Swiper(".gallery-slider", {
      slidesPerView: 1,
      loop: true,
      autoHeight: true,
      spaceBetween: 0,
      speed: 1500,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
})();

;
// accordion script
(function () {
  "use strict";

  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionItem = header.parentElement;
      accordionItem.classList.toggle("active");
    });
  });
})();

;
// tab script
(function () {
  "use strict";

  const tabGroups = document.querySelectorAll("[data-tab-group]");
  const tablist = document.querySelectorAll("[data-tab-nav] [data-tab]");

  function setActiveTab(tabGroup, tabName) {
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsContent = tabGroup.querySelector("[data-tab-content]");

    tabsNav.querySelectorAll("[data-tab]").forEach((tabNavItem) => {
      tabNavItem.classList.remove("active");
    });
    tabsContent.querySelectorAll("[data-tab-panel]").forEach((tabPane) => {
      tabPane.classList.remove("active");
    });

    const selectedTabNavItem = tabsNav.querySelector(`[data-tab="${tabName}"]`);
    selectedTabNavItem.classList.add("active");
    const selectedTabPane = tabsContent.querySelector(
      `[data-tab-panel="${tabName}"]`
    );
    selectedTabPane.classList.add("active");
  }

  tabGroups.forEach((tabGroup) => {
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");
    const activeTabName = tabsNavItem[0].getAttribute("data-tab");

    setActiveTab(tabGroup, activeTabName);

    tabsNavItem.forEach((tabNavItem) => {
      tabNavItem.addEventListener("click", () => {
        const tabName = tabNavItem.dataset.tab;
        setActiveTab(tabGroup, tabName);
      });
    });
  });

  function tabsHandler(event) {
    let index = Array.from(tablist).indexOf(this);
    let numbTabs = tablist.length;
    let nextId;
    if (numbTabs > 1) {
      if (event.key === "ArrowRight") {
        nextId = tablist[(index + 1) % numbTabs];
        if (index === numbTabs - 1) {
          nextId = tablist[0];
        }
        nextId.focus();
        nextId.click();
      }
      if (event.key === "ArrowLeft") {
        nextId = tablist[(index - 1 + numbTabs) % numbTabs];
        if (index === 0) {
          nextId = tablist[numbTabs - 1];
        }
        nextId.focus();
        nextId.click();
      }
    }
  }

  tablist.forEach(function (tab) {
    tab.addEventListener("keydown", tabsHandler);
  });
})();

;
// accordion script
(function () {
  "use strict";

  const openModalButtons = document.querySelectorAll("[data-modal-open]");
  const closeModalButtons = document.querySelectorAll("[data-modal-close]");

  function openModal(modal) {
    if (modal === null) {
      return null;
    }
    const overlay = modal.querySelector("[data-modal-overlay]");
    modal.style.display = "block";
    overlay.style.display = "block";
  }

  function closeModal(modal) {
    if (modal === null) {
      return null;
    }
    const overlay = modal.querySelector("[data-modal-overlay]");
    modal.style.display = "none";
    overlay.style.display = "none";
  }

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.nextElementSibling;
      openModal(modal);
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest("[data-modal]");
      closeModal(modal);
    });
  });
})();

;
!(function (e) {
  var n;
  if (
    ("function" == typeof define && define.amd && (define(e), (n = !0)),
    "object" == typeof exports && ((module.exports = e()), (n = !0)),
    !n)
  ) {
    var t = window.Cookies,
      o = (window.Cookies = e());
    o.noConflict = function () {
      return (window.Cookies = t), o;
    };
  }
})(function () {
  function f() {
    for (var e = 0, n = {}; e < arguments.length; e++) {
      var t = arguments[e];
      for (var o in t) n[o] = t[o];
    }
    return n;
  }
  function a(e) {
    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }
  return (function e(u) {
    function c() {}
    function t(e, n, t) {
      if ("undefined" != typeof document) {
        "number" == typeof (t = f({ path: "/" }, c.defaults, t)).expires &&
          (t.expires = new Date(1 * new Date() + 864e5 * t.expires)),
          (t.expires = t.expires ? t.expires.toUTCString() : "");
        try {
          var o = JSON.stringify(n);
          /^[\{\[]/.test(o) && (n = o);
        } catch (e) {}
        (n = u.write
          ? u.write(n, e)
          : encodeURIComponent(String(n)).replace(
              /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
              decodeURIComponent
            )),
          (e = encodeURIComponent(String(e))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape));
        var r = "";
        for (var i in t)
          t[i] &&
            ((r += "; " + i), !0 !== t[i] && (r += "=" + t[i].split(";")[0]));
        return (document.cookie = e + "=" + n + r);
      }
    }
    function n(e, n) {
      if ("undefined" != typeof document) {
        for (
          var t = {},
            o = document.cookie ? document.cookie.split("; ") : [],
            r = 0;
          r < o.length;
          r++
        ) {
          var i = o[r].split("="),
            c = i.slice(1).join("=");
          n || '"' !== c.charAt(0) || (c = c.slice(1, -1));
          try {
            var f = a(i[0]);
            if (((c = (u.read || u)(c, f) || a(c)), n))
              try {
                c = JSON.parse(c);
              } catch (e) {}
            if (((t[f] = c), e === f)) break;
          } catch (e) {}
        }
        return e ? t[e] : t;
      }
    }
    return (
      (c.set = t),
      (c.get = function (e) {
        return n(e, !1);
      }),
      (c.getJSON = function (e) {
        return n(e, !0);
      }),
      (c.remove = function (e, n) {
        t(e, "", f(n, { expires: -1 }));
      }),
      (c.defaults = {}),
      (c.withConverter = e),
      c
    );
  })(function () {});
});

;
// main author repo: https://github.com/justinribeiro/youtube-lite
// modified by: https://github.com/gethugothemes

class LiteYTEmbed extends HTMLElement {
  constructor() {
    super();
    this.isIframeLoaded = false;
    this.setupDom();
  }
  static get observedAttributes() {
    return ["videoid", "playlistid"];
  }
  connectedCallback() {
    this.addEventListener("pointerover", LiteYTEmbed.warmConnections, {
      once: true,
    });
    this.addEventListener("click", () => this.addIframe());
  }
  get videoId() {
    return encodeURIComponent(this.getAttribute("videoid") || "");
  }
  set videoId(id) {
    this.setAttribute("videoid", id);
  }
  get playlistId() {
    return encodeURIComponent(this.getAttribute("playlistid") || "");
  }
  set playlistId(id) {
    this.setAttribute("playlistid", id);
  }
  get videoTitle() {
    return this.getAttribute("videotitle") || "Video";
  }
  set videoTitle(title) {
    this.setAttribute("videotitle", title);
  }
  get videoPlay() {
    return this.getAttribute("videoPlay") || "Play";
  }
  set videoPlay(name) {
    this.setAttribute("videoPlay", name);
  }
  get videoStartAt() {
    return Number(this.getAttribute("videoStartAt") || "0");
  }
  set videoStartAt(time) {
    this.setAttribute("videoStartAt", String(time));
  }
  get autoLoad() {
    return this.hasAttribute("autoload");
  }
  get noCookie() {
    return this.hasAttribute("nocookie");
  }
  get posterQuality() {
    return this.getAttribute("posterquality") || "hqdefault";
  }
  get posterLoading() {
    return this.getAttribute("posterloading") || "lazy";
  }
  get params() {
    return `start=${this.videoStartAt}&${this.getAttribute("params")}`;
  }
  setupDom() {
    const shadowDom = this.attachShadow({ mode: "open" });
    shadowDom.innerHTML = `
    <style>
      :host {
        contain: content;
        display: block;
        position: relative;
        width: 100%;
        padding-bottom: calc(100% / (16 / 9));
        --lyt-animation: all 0.2s cubic-bezier(0, 0, 0.2, 1);
        --lyt-play-btn-default: #212121;
        --lyt-play-btn-hover: #f00;
      }

      #frame, #fallbackPlaceholder, iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top:0;
      }

      #frame {
        cursor: pointer;
      }

      #fallbackPlaceholder {
        object-fit: cover;
      }

      #frame::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        background-image: linear-gradient(180deg, #111 -20%, transparent 90%);
        height: 60px;
        width: 100%;
        transition: var(--lyt-animation);
        z-index: 1;
      }

      #playButton {
        width: 70px;
        height: 46px;
        z-index: 1;
        opacity: 0.9;
        border-radius: 14%;
        transition: var(--lyt-animation);
        border: 0;
        cursor:pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' version='1.1' viewBox='0 0 68 48' width='100%25'%3E%3Cpath class='ytp-large-play-button-bg' d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z' fill='%23f00'%3E%3C/path%3E%3Cpath d='M 45,24 27,14 27,34' fill='%23fff'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
        filter: grayscale(1);
        background-color: transparent !important;
      }

      #frame:hover > #playButton {
        opacity: 1;
        filter: grayscale(0);
      }

      #playButton {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }

      /* Post-click styles */
      .activated {
        cursor: unset;
      }

      #frame.activated::before,
      #frame.activated > #playButton {
        display: none;
      }
    </style>
    <div id="frame">
      <picture>
        <source id="webpPlaceholder" type="image/webp">
        <source id="jpegPlaceholder" type="image/jpeg">
        <img id="fallbackPlaceholder" referrerpolicy="origin">
      </picture>
      <button id="playButton"></button>
    </div>
  `;
    this.domRefFrame = shadowDom.querySelector("#frame");
    this.domRefImg = {
      fallback: shadowDom.querySelector("#fallbackPlaceholder"),
      webp: shadowDom.querySelector("#webpPlaceholder"),
      jpeg: shadowDom.querySelector("#jpegPlaceholder"),
    };
    this.domRefPlayButton = shadowDom.querySelector("#playButton");
  }
  setupComponent() {
    this.initImagePlaceholder();
    this.domRefPlayButton.setAttribute(
      "aria-label",
      `${this.videoPlay}: ${this.videoTitle}`
    );
    this.setAttribute("title", `${this.videoPlay}: ${this.videoTitle}`);
    if (this.autoLoad) {
      this.initIntersectionObserver();
    }
  }
  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case "videoid":
      case "playlistid": {
        if (oldVal !== newVal) {
          this.setupComponent();
          if (this.domRefFrame.classList.contains("activated")) {
            this.domRefFrame.classList.remove("activated");
            this.shadowRoot.querySelector("iframe").remove();
            this.isIframeLoaded = false;
          }
        }
        break;
      }
      default:
        break;
    }
  }
  addIframe(isIntersectionObserver = false) {
    if (!this.isIframeLoaded) {
      const autoplay = isIntersectionObserver ? 0 : 1;
      const wantsNoCookie = this.noCookie ? "-nocookie" : "";
      let embedTarget;
      if (this.playlistId) {
        embedTarget = `?listType=playlist&list=${this.playlistId}&`;
      } else {
        embedTarget = `${this.videoId}?`;
      }
      const iframeHTML = `
      <iframe frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
      src="https://www.youtube${wantsNoCookie}.com/embed/${embedTarget}rel=0&autoplay=${autoplay}&${this.params}"
      ></iframe>`;
      this.domRefFrame.insertAdjacentHTML("beforeend", iframeHTML);
      this.domRefFrame.classList.add("activated");
      this.isIframeLoaded = true;
      this.dispatchEvent(
        new CustomEvent("liteYoutubeIframeLoaded", {
          detail: {
            videoId: this.videoId,
          },
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }
  initImagePlaceholder() {
    LiteYTEmbed.addPrefetch("preconnect", "https://i.ytimg.com/");
    const posterUrlWebp = `https://i.ytimg.com/vi_webp/${this.videoId}/${this.posterQuality}.webp`;
    const posterUrlJpeg = `https://i.ytimg.com/vi/${this.videoId}/${this.posterQuality}.jpg`;
    this.domRefImg.fallback.loading = this.posterLoading;
    this.domRefImg.webp.srcset = posterUrlWebp;
    this.domRefImg.jpeg.srcset = posterUrlJpeg;
    this.domRefImg.fallback.src = posterUrlJpeg;
    this.domRefImg.fallback.setAttribute(
      "aria-label",
      `${this.videoPlay}: ${this.videoTitle}`
    );
    this.domRefImg?.fallback?.setAttribute(
      "alt",
      `${this.videoPlay}: ${this.videoTitle}`
    );
  }
  initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isIframeLoaded) {
          LiteYTEmbed.warmConnections();
          this.addIframe(true);
          observer.unobserve(this);
        }
      });
    }, options);
    observer.observe(this);
  }
  static addPrefetch(kind, url, as) {
    const linkElem = document.createElement("link");
    linkElem.rel = kind;
    linkElem.href = url;
    if (as) {
      linkElem.as = as;
    }
    linkElem.crossOrigin = "true";
    document.head.append(linkElem);
  }
  static warmConnections() {
    if (LiteYTEmbed.isPreconnected) return;
    LiteYTEmbed.addPrefetch("preconnect", "https://s.ytimg.com");
    LiteYTEmbed.addPrefetch("preconnect", "https://www.youtube.com");
    LiteYTEmbed.addPrefetch("preconnect", "https://www.google.com");
    LiteYTEmbed.addPrefetch(
      "preconnect",
      "https://googleads.g.doubleclick.net"
    );
    LiteYTEmbed.addPrefetch("preconnect", "https://static.doubleclick.net");
    LiteYTEmbed.isPreconnected = true;
  }
}
LiteYTEmbed.isPreconnected = false;
customElements.define("youtube-lite", LiteYTEmbed);

;
// main script
(function () {})();
