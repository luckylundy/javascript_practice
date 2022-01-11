const postIkku = document.querySelector('.postIkku');
const postBtn = document.querySelector('.postBtn');
const ikkulist = document.querySelector('.ikkuList');
const url = 'http://localhost:3000/ikku';


// Create
const createFetch = () => { // 定数createFetchに引数はないので() =>になっている
  const data = { // postIkkuの値をdataに代入
    ikku: postIkku.value
  };
  fetch(url, { // 定数urlに対して取得したリソースを指定した方式で返す
    method: 'POST',
    headers: { // postされたヘッダーのメディアタイプをJSONアプリケーションで指定
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // postリクエストに追加したいdataをJSON文字列に変換
  }).then((response) => {
    if(!response.ok) { // エラーを起こした時
      console.log('Create error!');
      throw new Error('error'); // Errorオブジェクトを例外として発生させて処理を終了させる
    }
    console.log('Create ok!'); // 成功時
    return response.json();
  }).then((data) => {
    appendList(data); // 配列に俳句を追加する
  }).catch((error) => { // 上のthenの処理が拒否された場合、発生したErrorをキャッチ
    console.log(error);
  });
};

postBtn.addEventListener('click', createFetch, false); // クリックした時createFetchメソッドを発動


// Read
const readFetch = () => {
  fetch(url).then((response) => {
    if(!response.ok) {
      console.log('Read error!');
      throw new Error('error');
    }
    console.log('Read ok!');
    return response.json();
  }).then((data) => {
    for (let i = 0; i < data.length; i++) { // 俳句の配列を句の回数分繰り返す
      const thisData = data[i];
      appendList(thisData);
    }
  }).catch((error) => {
    console.log(error);
  });
};

readFetch();


//Update
const updateFetch = (thisLi) => {
  const thisId = thisLi.dataset.id;
  const updateUrl = url + '/' + thisId;
  const updateArea = thisLi.querySelector('.updateArea');
  const updateIkku = thisLi.querySelector('.updateIkku').value;
  const data = {
    ikku: updateIkku
  };

  fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if(!response.ok) {
      console.log('Update error!');
      throw new Error('error');
    }
    console.log('Update ok!');
    return response.json();
  }).then((data) => {
    thisLi.firstChild.textContent = data.ikku;
    thisLi.removeChild(updateArea);
  }).catch((error) => {
    console.log(error);
  });
};

document.addEventListener('click', (e) => {
  if (e.target.className !== 'updateBtn') {
    return;
  }
  const thisLi = e.target.closest('li'); // 直近親要素の<li>を取得する
  updateFetch(thisLi); // <li>に対して定数updateFetchを発動させる
}, false);


// Delete
const deleteFetch = (thisLi) => {
  const thisId = thisLi.dataset.id; // 俳句のid
  const updateUrl = url + '/' + thisId; // /ikku/3みたいなurl

  fetch(updateUrl, {
    method: 'DELETE', // deleteメソッドを送信して句を削除
  }).then((response) => {
    if(!response.ok) {
      console.log('Delete error!');
      throw new Error('error');
    }
    console.log('Delete ok!');
  }).then(() => {
    thisLi.remove()
  }).catch((error) => {
    console.log(error);
  });
};



document.addEventListener('click', (e) => {
  if(e.target.className !== 'doDelete') {
    return;
  }

// 削除ボタンを押したら最終確認のモーダルウィンドウが出る
  const doDelete = document.getElementsByClassName('doDelete');
  for (let i = 0; i < doDelete.length; i++) {
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal');
    const innerElement = document.createElement('div');
    innerElement.classList.add('inner');

    innerElement.innerHTML = `
      <p>本当に削除しますか？</p>
    `;

    modalElement.appendChild(innerElement);
    document.body.appendChild(modalElement);

    innerElement.addEventListener('click', () => {
      closeModal(modalElement);
    });

    function closeModal(modalElement) {
      document.body.removeChild(modalElement);
    };
  };

  const thisLi = e.target.closest('li');
  deleteFetch(thisLi);
}, false);


// Append Button
const appendBtn = (className, text) => {
  const btn = document.createElement('button');
  btn.className = className;
  btn.innerHTML = text;
  return btn;
};


// Append List
const appendList = (thisData) => {
  const li = document.createElement('li');
  li.dataset.id = thisData.id;
  li.innerHTML = thisData.ikku;
  const updateBtn = appendBtn('doUpdate', '修正');
  li.appendChild(updateBtn);  // 修正ボタン追加
  const deleteBtn = appendBtn('doDelete', '削除');
  li.appendChild(deleteBtn); // 削除ボタン追加
  ikkulist.appendChild(li);
};


// Append Update Area
const appendUpdateInput = (thisIkku) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'updateIkku';
  input.size = '30';
  input.maxlength = '30px';
  input.className = 'updateIkku';
  input.value = thisIkku;
  return input;
};

const appendUpdateBtn = () => { // 送信ボタンを作成
  const btn = document.createElement('input');
  btn.type = 'button';
  btn.value = '送信';
  btn.className = 'updateBtn';
  return btn;
};

const appendUpdateArea = (thisLi) => {
  const thisIkku = thisLi.firstChild.textContent;
  const appendDiv = document.createElement('div'); //divを追加して修正エリア作成
  appendDiv.className = 'updateArea';
  appendDiv.appendChild(appendUpdateInput(thisIkku));
  appendDiv.appendChild(appendUpdateBtn());
  thisLi.appendChild(appendDiv);
};

document.addEventListener('click', (e) => {
  if(e.target.className !== 'doUpdate') {
    return;
  }
  const thisLi = e.target.closest('li');
  if(thisLi.querySelector('updateArea') === null) {
    appendUpdateArea(thisLi);
  }
}, false);