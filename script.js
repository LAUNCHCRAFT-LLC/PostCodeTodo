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
        `<li class="uk-flex uk-flex-middle uk-flex-between todo-item" data-index="${index}">` +
            `<span class="uk-margin-small-right checked" uk-icon="check"></span>` +
            `<input disabled class="uk-input title" type="text" placeholder="" value="${title}">` +
            '<button class="uk-button uk-button-primary uk-button-small uk-margin-small-right done-btn">Done</button>' +
            '<button class="uk-button uk-button-default uk-button-small uk-margin-small-right notyet-btn">NotYet</button>' +
            '<button class="uk-button uk-button-default uk-button-small edit-btn">Edit</button>' +
            '<button class="uk-button uk-button-primary uk-button-small uk-margin-left uk-margin-small-right save-btn">Save</button>' +
            '<button class="uk-button uk-button-danger uk-button-small uk-margin-small-right delete-btn">Delete</button>' +
            '<button class="uk-button uk-button-secondary uk-button-small cancel-btn">Cancel</button>' +
            `<span class="uk-margin-small-left sortable" uk-icon="table"></span>` +
        '</li>'
    );
    return liDom;
});

/**
 * Todoのデータを取得
 * @returns Array: Todoのデータを配列で返す
 */
const getTodoData = () => {
    // ローカルストレージのデータを取得
    const todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
    // JSONで保存しているので配列に変換
    let todoData = JSON.parse(todoDataJson);
    if (todoData) {
        // ソート
        todoData.sort((a, b) => a.done - b.done);
    }
    return todoData;
};

/**
 * Todoのデータを保存
 * @param {*} todoData Array: Todoのデータ
 */
 const saveTodoData = (todoData) => {
    // JSON文字列に変換
    const todoDataArrayJson = JSON.stringify(todoData);
    // ローカルストレージに保存
    localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);
};


$(() => {

    // ローカルストレージに保存しているTodoを取得して画面に表示する ----------------------
    let todoData = getTodoData();
    if (todoData) {
        // ループで回す ----------------------------------------------------------
        // ループをカウントする様の変数
        let index = 0;
        todoData.forEach(todoData => {
            // Todoのタイトルをひとつずつ取得し li 要素にする
            let todoList = createListDom(todoData.title, index);
            // Todoが完了していたらdoneクラスを付与する
            if (todoData.done) {
                todoList.addClass('done');
            }
            // HTMLに追加する
            $('#todo-list').append(todoList);

            index++;
        });
    }

    // ドラッグ有効化
    $('#todo-list').sortable({
        handle: '.sortable',
        cursor: 'pointer',
        update: (e, ui) => {
            let todoData = [];
            $.each($('#todo-list li'), (index, val) => {
                let todoDataId = $(val).attr('data-id');
                todoData.push({
                    title: $(val).find('.title').val(),
                    done: $(val).hasClass('done'),
                })
                saveTodoData(todoData);
            });
        },
    });

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

        // テキストフィールドを空にする
        $('#input-todo-title').val('');

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

        // 配列に入力したTodoのデータを追加
        const todoDataItem = {
            title: inputTodoTitle,
            done: false,
        };
        todoData.push(todoDataItem);
        // JSON文字列に変換
        const todoDataArrayJson = JSON.stringify(todoData);
        // ローカルストレージに保存
        localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);

        const liDom = $(
            '<div class="uk-alert-primary" uk-alert>' +
            '<a class="uk-alert-close" uk-close></a>' +
            '<p>保存しました</p>' +
            '</div>'
        );

        $('#main form').after(liDom.hide().fadeIn(500))
        setTimeout(() => {
            UIkit.alert($('.uk-alert-primary')).close();
        }, 2000)

        // formの処理を止める
        return false;
    });

    /**
     * 編集ボタンのクリックイベントを取得
     */
    $(document).on('click', '.edit-btn', (e) => {

        // 編集ボタンの親要素のliにeditというクラス名を付与
        $(e.target).parent().addClass('edit');

        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();
        // findでインプット要素を検索しdisabledを有効にする
        parentLi.find('input').prop('disabled', false);
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
        todoData[index].title = inputTodoTitle;
        // JSON文字列に変換
        const todoDataArrayJson = JSON.stringify(todoData);
        // ローカルストレージに保存
        localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);

        // editというクラス名を削除
        parentLi.removeClass('edit');
        // findでインプット要素を検索しdisabledを有効にする
        parentLi.find('input').prop('disabled', true);
    });

    /**
     * 削除ボタンのクリックイベントを取得
     */
    $(document).on('click', '.delete-btn', (e) => {
        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();

        // ローカルストレージのデータを取得
        const todoDataJson = localStorage.getItem(LocalStorageKeyTodoData);
        // JSONで保存しているので配列に変換
        let todoData = JSON.parse(todoDataJson);
        // li要素に付与していた何番目かのインデックスを取得
        let index = parentLi.attr('data-index');
        // 配列の中身を削除
        todoData.splice(index, 1);
        // JSON文字列に変換
        const todoDataArrayJson = JSON.stringify(todoData);
        // ローカルストレージに保存
        localStorage.setItem(LocalStorageKeyTodoData, todoDataArrayJson);
        // HTMLからも取り除く
        parentLi.remove();
    });

    /**
     * 完了ボタンのクリックイベントを取得
     */
    $(document).on('click', '.done-btn', (e) => {
        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();
        parentLi.addClass('done');

        // 要素を一番下に移動
        $('#todo-list').append(parentLi);

        // todoのデータを取得
        const todoData = getTodoData();
        // li要素に付与していた何番目かのインデックスを取得
        let index = parentLi.attr('data-index');
        todoData[index].done = true;
        // ローカルストレージを保存
        saveTodoData(todoData);
    });

    /**
     * 完了訂正ボタンのクリックイベントを取得
     */
     $(document).on('click', '.notyet-btn', (e) => {
        // 編集ボタンの親要素のliを取得
        const parentLi = $(e.target).parent();
        parentLi.removeClass('done');

        // 要素を一番上に移動
        $('#todo-list').prepend(parentLi);

        // todoのデータを取得
        const todoData = getTodoData();
        // li要素に付与していた何番目かのインデックスを取得
        let index = parentLi.attr('data-index');
        todoData[index].done = false;
        // ローカルストレージを保存
        saveTodoData(todoData);
    });
});