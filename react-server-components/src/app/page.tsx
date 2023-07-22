import Link from "next/link";

export default async function TodosApp() {
  return (
    <div>
      <h1>Check out the examples</h1>
      <Link href="/todo-simple">Simple</Link>
      <br />
      <Link href="/todo-with-delete">With Delete</Link>
    </div>
  );
}
