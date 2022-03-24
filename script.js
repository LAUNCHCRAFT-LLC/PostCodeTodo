// ローカルストレージのキーになる文字列
const LocalStorageKeyTodoData = 'TodoData';

/**
 * Todoリストに表示に使用するli要素を整形する
 * @param {*} title 文字列: Todoのタイトル
 * @returns domオブジェクト: li要素のdom
 */
const createListDom = ((title, index) => {
    const liDom = $(
        // data-indexに何番目かのインデックスを持たせる
        `<li class="uk-flex uk-flex-between todo-item" data-index="${index}">` +
            `<input disabled class="uk-input" type="text" placeholder="" value="${title}">` +
            '<button class="uk-button uk-button-default uk-button-small edit-btn">Edit</button>' +
            '<button class="uk-button uk-button-primary uk-button-small uk-margin-left uk-margin-small-right save-btn">Save</button>' +
            '<button class="uk-button uk-button-secondary uk-button-small cancel-btn">Cancel</button>' +
        '</li>'
    );
    return liDom;
})

$(() => {

    // ローカルストレージに保存しているTodoを取得して画面に表示する ----------------------
    let todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
    // JSON文字列で保存しているので一度配列に変換
    let todoData = JSON.parse(todoDataJson);
    if (todoData) {
        // ループで回す ----------------------------------------------------------
        // ループをカウントする様の変数
        let index = 0;
        todoData.forEach(todoTitle => {
            // TODOのタイトルをひとつずつ取得し li 要素にする
            let todoList = createListDom(todoTitle, index);
            // HTMLに追加する
            $('#todo-list').append(todoList);

            index++;
        });
    }

    /**
     * Add Todoボタンがクリックした時に実行される関数
     * Add Todoボタンを梱包するFormイベントを取得する形
     */
    $('form').submit(() => {

        // 入力したTODOのタイトルを取得
        const inputTodoTitle = $('#input-todo-title').val();

        // 入力した値が空の場合は処理をしない
        if (!inputTodoTitle) {
            // 処理を止める
            return false;
        }

        // ローカルストレージに保存 ------------------------------------------------
        // ローカルストレージに保存しているデータを取得
        const todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
        // JSONで保存しているので配列に変換
        let todoData = JSON.parse(todoDataJson);
        // todoDataが空の場合は配列にする
        if (!todoData) {
            todoData = [];
        }

        let todoList = createListDom(inputTodoTitle, todoData.length);
        $('#todo-list').append(todoList);

        // 配列に入力したタイトルを追加
        todoData.push(inputTodoTitle);
        // JSON文字列に変換
        const todoDataArrayJson = JSON.stringify(todoData);
        // ローカルストレージに保存
        localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);

        // formの処理を止める
        return false;
    });

    /**
     * 編集ボタンのクリックイベントを取得
     */
    $(document).on('click', '.edit-btn', (e) => {

        // 編集ボタンの親要素のliにeditというクラス名を付与
        $(e.target).parent().addClass('edit');

        // 編集ボタンの隣(一つ前の要素)を取得
        let totoInput = $(e.target).prev();
        totoInput.prop('disabled', false);
    });

    /**
     * キャンセルボタンのクリックイベントを取得
     */
     $(document).on('click', '.cancel-btn', (e) => {

        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();

        // editというクラス名を削除
        parentLi.removeClass('edit');

        // findでインプット要素を検索しdisabledを有効にする
        parentLi.find('input').prop('disabled', true);
    });

    /**
     * 保存ボタンのクリックイベントを取得
     */
     $(document).on('click', '.save-btn', (e) => {

        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();

        // findでインプット要素を検索し入力した値を取得
        const inputTodoTitle = parentLi.find('input').val();
        // 入力した値が空の場合は処理をしない
        if (!inputTodoTitle) {
            // 処理を止める
            return false;
        }

        // ローカルストレージに保存 ------------------------------------------------

        // ローカルストレージのデータを取得
        const todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
        // JSONで保存しているので配列に変換
        let todoData = JSON.parse(todoDataJson);
        // li要素に付与していた何番目かのインデックスを取得
        let index = parentLi.attr('data-index');
        // 配列の中身を入れ替え
        todoData[index] = inputTodoTitle;
        // JSON文字列に変換
        const todoDataArrayJson = JSON.stringify(todoData);
        // ローカルストレージに保存
        localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);

        // editというクラス名を削除
        parentLi.removeClass('edit');
        // findでインプット要素を検索しdisabledを有効にする
        parentLi.find('input').prop('disabled', true);
    });
});