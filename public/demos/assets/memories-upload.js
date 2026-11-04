(function () {
  "use strict";

  var DB_NAME = "ourmoment-wedding-memories-demo";
  var STORE_NAME = "uploads";
  var objectUrls = [];

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error("Could not open local demo storage.")); };
    });
  }

  function runTransaction(mode, action) {
    return openDatabase().then(function (db) {
      return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, mode);
        var request = action(transaction.objectStore(STORE_NAME));
        var result;
        request.onsuccess = function () { result = request.result; };
        request.onerror = function () { reject(request.error || new Error("The browser could not save this memory.")); };
        transaction.oncomplete = function () {
          db.close();
          resolve(result);
        };
        transaction.onerror = function () {
          db.close();
          reject(transaction.error || new Error("The browser could not save this memory."));
        };
        transaction.onabort = function () {
          db.close();
          reject(transaction.error || new Error("The browser cancelled this save."));
        };
      });
    });
  }

  var style = document.createElement("style");
  style.textContent = [
    ".memory-upload-launch{position:fixed;z-index:140;left:18px;bottom:18px;display:flex;gap:8px;align-items:center}",
    ".memory-upload-launch button,.memory-upload-dialog button{font:600 12px system-ui,sans-serif;cursor:pointer}",
    ".memory-upload-primary{border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:12px 17px;background:#a71950;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,.24)}",
    ".memory-upload-admin{border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:11px 14px;background:rgba(30,20,20,.86);color:#fff}",
    ".memory-upload-dialog{width:min(560px,calc(100vw - 28px));max-height:min(86vh,760px);padding:0;border:1px solid rgba(180,120,125,.3);border-radius:22px;background:#fffaf7;color:#33252a;box-shadow:0 30px 100px rgba(0,0,0,.4)}",
    ".memory-upload-dialog::backdrop{background:rgba(24,12,17,.72);backdrop-filter:blur(7px)}",
    ".memory-upload-content{padding:24px;overflow:auto;max-height:min(86vh,760px)}",
    ".memory-upload-head{display:flex;justify-content:space-between;align-items:start;gap:16px;margin-bottom:18px}",
    ".memory-upload-head h2{font:600 29px/1.05 Georgia,serif;color:#5d1836}",
    ".memory-upload-close{width:36px;height:36px;border:1px solid #ead7da;border-radius:50%;background:#fff;color:#5d1836;font-size:20px}",
    ".memory-upload-form{display:grid;gap:12px}",
    ".memory-upload-form label{display:grid;gap:5px;font:600 11px system-ui,sans-serif;color:#60444e}",
    ".memory-upload-form input,.memory-upload-form select,.memory-upload-form textarea{width:100%;border:1px solid #e8dadd;border-radius:10px;padding:11px 12px;background:#fff;color:#33252a;font:13px system-ui,sans-serif}",
    ".memory-upload-form textarea{min-height:80px;resize:vertical}",
    ".memory-upload-note{margin:12px 0;padding:11px 12px;border-radius:10px;background:#fff0f3;color:#7b4055;font:11px/1.6 system-ui,sans-serif}",
    ".memory-upload-status{min-height:20px;color:#7b4055;font:12px/1.5 system-ui,sans-serif}",
    ".memory-upload-submit{border:0;border-radius:999px;padding:12px 18px;background:#8f1749;color:#fff}",
    ".memory-upload-link{border:0;padding:4px 0;background:none;color:#8f1749;text-decoration:underline;text-underline-offset:3px}",
    ".memory-upload-entry{display:grid;grid-template-columns:88px 1fr;gap:12px;padding:12px 0;border-bottom:1px solid #eadfe0}",
    ".memory-upload-entry img,.memory-upload-entry video{width:88px;height:88px;object-fit:cover;border-radius:9px;background:#f0e5e5}",
    ".memory-upload-entry audio{width:100%;max-width:320px}",
    ".memory-upload-entry p{margin:2px 0;color:#624c52;font:12px/1.5 system-ui,sans-serif;overflow-wrap:anywhere}",
    ".memory-upload-delete{margin-top:7px;border:1px solid #e5c4cc;border-radius:999px;padding:6px 10px;background:#fff;color:#8f1749}",
    "@media(max-width:520px){.memory-upload-launch{left:10px;bottom:10px;right:10px}.memory-upload-primary{flex:1}.memory-upload-admin{padding:11px 12px}.memory-upload-content{padding:18px}.memory-upload-entry{grid-template-columns:70px 1fr}.memory-upload-entry img,.memory-upload-entry video{width:70px;height:70px}}",
    "@media(prefers-reduced-motion:reduce){.memory-upload-dialog *{scroll-behavior:auto!important}}"
  ].join("");
  document.head.appendChild(style);

  var launch = document.createElement("div");
  launch.className = "memory-upload-launch";
  launch.innerHTML = '<button class="memory-upload-primary" type="button" data-open-upload>Leave a memory <span aria-hidden="true">↗</span></button><button class="memory-upload-admin" type="button" data-open-admin>Admin</button>';
  document.body.appendChild(launch);

  var dialog = document.createElement("dialog");
  dialog.className = "memory-upload-dialog";
  dialog.setAttribute("aria-label", "Share a wedding memory");
  dialog.innerHTML = '<div class="memory-upload-content"><div class="memory-upload-head"><div><p style="margin-bottom:6px;color:#a71950;font:700 9px system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase">A keepsake made together</p><h2 data-title>Leave a memory</h2></div><button class="memory-upload-close" type="button" aria-label="Close">×</button></div><div data-panel></div></div>';
  document.body.appendChild(dialog);
  var panel = dialog.querySelector("[data-panel]");
  var title = dialog.querySelector("[data-title]");
  var status = null;

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? "#a12636" : "#7b4055";
  }

  function setPanel(markup, heading) {
    title.textContent = heading;
    panel.innerHTML = markup;
    status = panel.querySelector(".memory-upload-status");
  }

  function showGuestForm() {
    setPanel(
      '<form class="memory-upload-form" data-upload-form>' +
        '<label>Your name<input name="name" autocomplete="name" maxlength="80" required placeholder="Who is sharing this?"></label>' +
        '<label>Celebration<select name="event"><option>Haldi</option><option>Mehendi</option><option>Sangeet</option><option>Wedding</option><option>Reception</option><option>Other</option></select></label>' +
        '<label>Add photos, videos or voice notes<input name="files" type="file" accept="image/*,video/*,audio/*" multiple required></label>' +
        '<label>A note for the couple (optional)<textarea name="note" maxlength="500" placeholder="Add the story behind this moment"></textarea></label>' +
        '<p class="memory-upload-note">Demo upload: your original files are kept in this browser only. They are not sent to the couple or uploaded to a server.</p>' +
        '<p class="memory-upload-status" role="status" aria-live="polite"></p>' +
        '<button class="memory-upload-submit" type="submit">Add to this keepsake</button>' +
        '<button class="memory-upload-link" type="button" data-admin-login>Admin access</button>' +
      '</form>',
      heading
    );
    panel.querySelector("[data-upload-form]").addEventListener("submit", saveUploads);
    panel.querySelector("[data-admin-login]").addEventListener("click", showLogin);
  }

  function saveUploads(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var files = Array.prototype.slice.call(form.elements.files.files || []);
    var name = form.elements.name.value.trim();
    var note = form.elements.note.value.trim();
    var eventName = form.elements.event.value;
    if (!name || files.length === 0) {
      showStatus("Add your name and choose at least one file.", true);
      return;
    }
    if (files.some(function (file) { return !/^(image|video|audio)\//.test(file.type); })) {
      showStatus("Choose image, video or audio files only.", true);
      return;
    }
    var button = form.querySelector('[type="submit"]');
    button.disabled = true;
    showStatus("Saving your original files in this browser…", false);
    Promise.all(files.map(function (file) {
      return runTransaction("readwrite", function (store) {
        return store.add({
          id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random(),
          name: name,
          event: eventName,
          note: note,
          fileName: file.name,
          fileType: file.type,
          createdAt: new Date().toISOString(),
          blob: file
        });
      });
    })).then(function () {
      showStatus(files.length + " file" + (files.length === 1 ? "" : "s") + " saved in this browser.", false);
      form.reset();
    }).catch(function (error) {
      showStatus("Could not save your file: " + error.message + " Try a smaller file or check this browser’s storage.", true);
    }).then(function () {
      button.disabled = false;
    });
  }

  function showLogin() {
    setPanel(
      '<form class="memory-upload-form" data-login-form>' +
        '<label>Username<input name="username" autocomplete="username" required></label>' +
        '<label>Password<input name="password" type="password" autocomplete="current-password" required></label>' +
        '<p class="memory-upload-note">Demo credentials: admin / admin. This static prototype is not secure and must not be used for real guest data.</p>' +
        '<p class="memory-upload-status" role="status" aria-live="polite"></p>' +
        '<button class="memory-upload-submit" type="submit">Open local uploads</button>' +
        '<button class="memory-upload-link" type="button" data-back>Back to upload</button>' +
      '</form>',
      "Admin sign in"
    );
    panel.querySelector("[data-login-form]").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      if (form.elements.username.value === "admin" && form.elements.password.value === "admin") {
        showUploads();
      } else {
        showStatus("That demo username or password did not match.", true);
      }
    });
    panel.querySelector("[data-back]").addEventListener("click", function () { showGuestForm(); });
  }

  function clearObjectUrls() {
    objectUrls.forEach(function (url) { URL.revokeObjectURL(url); });
    objectUrls = [];
  }

  function showUploads() {
    clearObjectUrls();
    setPanel('<p class="memory-upload-status" role="status" aria-live="polite">Loading local uploads…</p><div data-entries></div><button class="memory-upload-link" type="button" data-back>Back to upload</button>', "Guest memories");
    var entries = panel.querySelector("[data-entries]");
    runTransaction("readonly", function (store) { return store.getAll(); }).then(function (records) {
      status.textContent = "";
      if (!records.length) {
        entries.textContent = "No guest uploads are saved in this browser yet.";
        return;
      }
      records.sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); }).forEach(function (record) {
        var item = document.createElement("article");
        item.className = "memory-upload-entry";
        var url = URL.createObjectURL(record.blob);
        objectUrls.push(url);
        var preview;
        if (record.fileType.indexOf("image/") === 0) {
          preview = document.createElement("img");
          preview.alt = record.fileName;
        } else if (record.fileType.indexOf("video/") === 0) {
          preview = document.createElement("video");
          preview.controls = true;
        } else {
          preview = document.createElement("audio");
          preview.controls = true;
        }
        preview.src = url;
        var detail = document.createElement("div");
        var description = document.createElement("p");
        description.textContent = record.name + " · " + record.event + " · " + new Date(record.createdAt).toLocaleString();
        detail.appendChild(description);
        if (record.note) {
          var note = document.createElement("p");
          note.textContent = "“" + record.note + "”";
          detail.appendChild(note);
        }
        var filename = document.createElement("p");
        filename.textContent = record.fileName;
        detail.appendChild(filename);
        var download = document.createElement("a");
        download.href = url;
        download.download = record.fileName;
        download.textContent = "Download original";
        download.style.cssText = "display:inline-block;margin:5px 10px 0 0;color:#8f1749;font:600 11px system-ui,sans-serif";
        detail.appendChild(download);
        var remove = document.createElement("button");
        remove.className = "memory-upload-delete";
        remove.type = "button";
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
          remove.disabled = true;
          runTransaction("readwrite", function (store) { return store.delete(record.id); }).then(showUploads).catch(function (error) {
            remove.disabled = false;
            showStatus("Could not remove this upload: " + error.message, true);
          });
        });
        detail.appendChild(remove);
        item.appendChild(preview);
        item.appendChild(detail);
        entries.appendChild(item);
      });
    }).catch(function (error) {
      showStatus("Could not read local uploads: " + error.message, true);
    });
    panel.querySelector("[data-back]").addEventListener("click", function () { showGuestForm(); });
  }

  launch.querySelector("[data-open-upload]").addEventListener("click", function () {
    showGuestForm();
    dialog.showModal();
  });
  launch.querySelector("[data-open-admin]").addEventListener("click", function () {
    showLogin();
    dialog.showModal();
  });
  dialog.querySelector(".memory-upload-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", clearObjectUrls);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dialog.open) dialog.close();
  });
})();
