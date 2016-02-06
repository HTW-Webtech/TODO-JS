// Führe die Funktion `initialize` aus, wenn die Seite fertig geladen ist
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
   // Referenz auf das Eingabefeld
   var input = document.querySelector('input');
   // Referenz auf die Liste
   var liste = document.querySelector('ul');
   // Die von der Festplatte geladenen Todos
   // wenn es noch kein Element mit dem Namen `todo` gibt, nimm ein leeres Array
   var oldTodos = JSON.parse(localStorage.getItem('todos')) || [];

   // Ein Todo-Listen-Objekt, das sich um die Verwaltung der Todos kümmert
   var todoList = new TodoList(liste);
   // Neue Todos aus den Daten der alten Todos erzeugen
   oldTodos.forEach(todoList.createTodo.bind(todoList));

   // Auf Enter-Taste lauschen und neues Todo erzeugen
   input.addEventListener('keydown', function(event) {
      if (event.keyCode !== 13) return;

      var data = {
         title: this.value,
         isDone: false,
      };

      todoList.createTodo(data);

      this.value = '';
   });
}


// ------------------------------------------------------------

/**
 * Kümmert sich um die Verwaltung einer Menge an Todos
 * @param {Element} element Das DOM-Element, das die Todo-Liste repräsentiert
 */
var TodoList = function(element) {
   this.todos = [];
   this.element = element;
};

/**
 * Erzeugt ein neues Todo
 * @param  {Object} data Daten des zu erstellenden Todos
 */
TodoList.prototype.createTodo = function(data) {
   var todo = new Todo(data, this.todos);
   this.todos.push(todo);

   var todoElement = todo.render();
   todoElement.addEventListener('click', this.persist.bind(this));
   this.element.appendChild(todoElement);

   this.persist();
};

/**
 * Persistiert die aktuelle Todo-Liste
 */
TodoList.prototype.persist = function() {
   var todos = this.todos.map(function(todo) {
      return todo.toJSON();
   });
   var json = JSON.stringify(todos);
   localStorage.setItem('todos', json);
};


// ------------------------------------------------------------


/**
 * Ein Todo
 * @param {Object} data       Daten des zu erstellenden Todos
 * @param {Array}  collection Liste aller Todos (wird zum Löschen benötigt)
 */
var Todo = function(data, collection) {
   this.title = data.title || '';
   this.isDone = !!data.isDone;
   this.collection = collection;
   this.element = document.createElement('li');

   var that = this;
   this.element.addEventListener('click', function(event) {
      if (event.target.nodeName === 'BUTTON') {
         that.remove();
      } else {
         that.toggle();
      }
   });
};

/**
 * Entfernt ein Todo (aus dem DOM und der Liste aller Todos)
 */
Todo.prototype.remove = function() {
   var index = this.collection.indexOf(this);

   this.collection.splice(index, 1);
   this.element.parentNode.removeChild(this.element);
};

/**
 * Rendert ein Todo und gibt das fertige Element zurück
 * @return {Element} Das DOM-Element des Todos
 */
Todo.prototype.render = function() {
   var checked = this.isDone ? 'checked' : '';
   this.element.innerHTML = '<input type="checkbox" ' + checked + '> ' + this.title + ' <button>☠</button>';
   this.element.classList.toggle('done', this.isDone);
   return this.element;
};

/**
 * Alterniert den Status eines Todos zwischen offen und abgeschlossen
 */
Todo.prototype.toggle = function() {
   this.isDone = !this.isDone;
   this.render();
};

/**
 * Gibt den Zustand des Todos zurück (für die spätere Serialisierung)
 * @return {Object} Der Zustand des Todos
 */
Todo.prototype.toJSON = function() {
   var data = {
      title: this.title,
      isDone: this.isDone,
   };
   return data;
};
