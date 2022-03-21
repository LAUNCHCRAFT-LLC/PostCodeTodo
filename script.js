$(() => {
    $('form').submit(() => {
        const inputTodoTitle = $('#input-todo-title').val();
        let todoList = $(`<li>${inputTodoTitle}</li>`)
        $('#todo-list').append(todoList);
        return false;
    });
});