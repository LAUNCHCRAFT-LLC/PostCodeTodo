// ローカルストレージのキーになる文字列
const LocalStorageKeyTodoData = 'TodoData';

$(() => {

    // ローカルストレージに保存しているTodoを取得して画面に表示する ----------------------
    let todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
    // JSON文字列で保存しているので一度配列に変換
    let todoData = JSON.parse(todoDataJson);
    if (todoData) {
        // ループで回す
        todoData.forEach(todoTitle => {
            // TODOのタイトルをひとつずつ取得し li 要素にする
            let todoList = $(`<li>${todoTitle}</li>`);
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
        let todoList = $(`<li>${inputTodoTitle}</li>`)
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
});