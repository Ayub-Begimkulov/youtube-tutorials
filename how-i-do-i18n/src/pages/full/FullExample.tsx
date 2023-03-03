import { useRef, useState } from "react";
import { i18n, I18NProvider, TaggedText, useI18N, useTranslate } from "./i18n";
import { getId } from "./utils/getId";

export const FullExample = () => {
  return (
    <I18NProvider i18n={i18n}>
      <FullExampleInner />
    </I18NProvider>
  );
};

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  createdAt: number;
}

const languagesList = [
  { value: "ru", title: "Русский" },
  { value: "en", title: "English" },
];

const FullExampleInner = () => {
  const [items, setItems] = useState<TodoItem[]>([]);
  const createTaskInputRef = useRef<HTMLInputElement>(null);

  const translate = useTranslate();
  const i18n = useI18N();

  const updateLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.setLang(e.target.value as "en" | "ru");
  };

  const handleAddTodo = (title: string) => {
    setItems((items) => [
      ...items,
      {
        id: getId(),
        title,
        done: false,
        createdAt: Date.now(),
      },
    ]);
  };

  const handleCreateTask = () => {
    createTaskInputRef.current?.focus();
  };

  const handleDeleteTodo = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const handleToggleTodoDone = (id: number) => {
    setItems((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return { ...item, done: !item.done };
      })
    );
  };

  const renderList = () => {
    if (items.length === 0) {
      return (
        <div>
          <h3>{translate("FullExample.welcome_message", { name: "Ayub" })}</h3>
          <p>
            <TaggedText
              text={translate("FullExample.welcome_submessage")}
              tags={{
                1: (text) => <button onClick={handleCreateTask}>{text}</button>,
              }}
            />
          </p>
        </div>
      );
    }

    return (
      <TodoList
        items={items}
        onDeleteTodo={handleDeleteTodo}
        onToggleTodoDone={handleToggleTodoDone}
      />
    );
  };

  return (
    <div style={{ margin: 12, maxWidth: 500 }}>
      <select
        value={i18n.getLang()}
        onChange={updateLang}
        style={{ marginBottom: 8 }}
      >
        {languagesList.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.title}
          </option>
        ))}
      </select>
      <AddTodoForm inputRef={createTaskInputRef} onAddTodo={handleAddTodo} />
      <div style={{ marginTop: 12 }}>{renderList()}</div>
    </div>
  );
};

interface AddTodoFormProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onAddTodo: (title: string) => void;
}

const AddTodoForm = ({ inputRef, onAddTodo }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const translate = useTranslate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    onAddTodo(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder={translate("AddTodoForm.placeholder")}
      />
      <button>{translate("AddTodoForm.button_text")}</button>
    </form>
  );
};

interface TodoListProps {
  items: TodoItem[];
  onToggleTodoDone: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TodoList = ({ items, onToggleTodoDone, onDeleteTodo }: TodoListProps) => {
  const translate = useTranslate();

  return (
    <div>
      <div>{translate("TodoList.items_info", { count: items.length })}</div>
      {items.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onDelete={onDeleteTodo}
          onToggleDone={onToggleTodoDone}
        />
      ))}
    </div>
  );
};

interface TodoItemProps {
  item: TodoItem;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ item, onDelete, onToggleDone }: TodoItemProps) => {
  const translate = useTranslate();

  return (
    <div
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggleDone(item.id)}
          style={{ marginRight: 5 }}
        />
        {item.title}
      </div>
      <button onClick={() => onDelete(item.id)}>
        {translate("TodoItem.delete_button_text")}
      </button>
    </div>
  );
};
