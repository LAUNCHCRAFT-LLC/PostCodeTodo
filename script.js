// ローカルストレージのキーになる文字列
const LocalStorageKeyTodoData = 'TodoData';

/**
 * Todoリストに表示に使用するli要素を整形する
 * @param {*} title 文字列: Todoのタイトル
 * @returns domオブジェクト: li要素のdom
 */
const createListDom = ((title) => {
    const liDom = $(
        '<li class="uk-flex uk-flex-between todo-item">' +
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
        // ループで回す
        todoData.forEach(todoTitle => {
            // TODOのタイトルをひとつずつ取得し li 要素にする
            let todoList = createListDom(todoTitle);
            // HTMLに追加する
            $('#todo-list').append(todoList);
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
        let todoList = createListDom(inputTodoTitle);
        $('#todo-list').append(todoList);

        // ローカルストレージに保存 ------------------------------------------------
        // ローカルストレージに保存しているデータを取得
        const todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
        // JSONで保存しているので配列に変換
        let todoData = JSON.parse(todoDataJson);
        // todoDataが空の場合は配列にする
        if (!todoData) {
            todoData = [];
        }
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
});