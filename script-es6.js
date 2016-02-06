{ // eigener Block um globalen Raum nicht unnötig zu verschmutzen

   document.addEventListener('DOMContentLoaded', initialize);

   function initialize() {
      const input = document.querySelector('input');
      const liste = document.querySelector('ul');
      const oldTodos = JSON.parse(localStorage.getItem('todos')) || [];

      const todoList = new TodoList(liste);
      oldTodos.forEach((data) => todoList.createTodo(data));

      input.addEventListener('keydown', (event) => {
         if (event.keyCode !== 13) return;

         const data = {
            title: input.value,
            isDone: false,
         };

         todoList.createTodo(data);

         input.value = '';
      });
   }


   // ------------------------------------------------------------


   class TodoList {

      constructor(element) {
         this.todos = [];
         this.element = element;
      }

      createTodo(data = {}) {
         const todo = new Todo(data, this.todos);
         this.todos.push(todo);

         const todoElement = todo.render();
         todoElement.addEventListener('click', () => this.persist());
         this.element.appendChild(todoElement);

         this.persist();
      }

      persist() {
         const todos = this.todos.map(todo => todo.toJSON());
         const json = JSON.stringify(todos);
         localStorage.setItem('todos', json);
      }

   }


   // ------------------------------------------------------------


   class Todo {

      constructor({ title = '', isDone = false }, collection = []) {
         this.title = title;
         this.isDone = isDone;
         this.collection = collection;
         this.element = document.createElement('li');

         this.element.addEventListener('click', (event) => {
            if (event.target.nodeName === 'BUTTON') {
               this.remove();
            }
            else {
               this.toggle();
            }
         });
      }

      remove() {
         const index = this.collection.indexOf(this);
         this.collection.splice(index, 1);
         this.element.parentNode.removeChild(this.element);
      }

      render() {
         const checked = this.isDone ? 'checked' : '';
         this.element.innerHTML = `<input type="checkbox" ${checked}>${this.title}<button>❌</button>`;
         this.element.classList.toggle('done', this.isDone);
         return this.element;
      }

      toggle() {
         this.isDone = !this.isDone;
         this.render();
      }

      toJSON() {
         const data = {
            title: this.title,
            isDone: this.isDone,
         };
         return data;
      }

   }

}
