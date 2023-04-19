import Head from 'next/head'
import { useEffect, useState } from "react"
import type { Item } from '@api/lists'

const checkSVG = <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 96 960 960"><path d="M378 810 154 586l43-43 181 181 384-384 43 43-427 427Z" /></svg>
const deleteSVG = <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 96 960 960"><path d="M261 936q-24 0-42-18t-18-42V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm106-146h60V391h-60v399Zm166 0h60V391h-60v399Z" /></svg>
const undoSVG = <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 96 960 960"><path d="M280 856v-60h289q70 0 120.5-46.5T740 634q0-69-50.5-115.5T569 472H274l114 114-42 42-186-186 186-186 42 42-114 114h294q95 0 163.5 64T800 634q0 94-68.5 158T568 856H280Z" /></svg>

const fetchList = async () => {
  return (await fetch('/api/lists')).json()
}

const createTodo = async (todo: string): Promise<Item> => {
  let res = await fetch('/api/lists', { method: 'POST', body: todo })
  return await res.json()
}

const updateTodo = async (index: number, completed: boolean) => {
  await fetch('/api/lists', { method: 'PATCH', body: JSON.stringify({ index, completed }), headers: { 'Content-Type': 'application/json' } })
}

const deleteTodo = async (index: number) => {
  await fetch(`/api/lists?index=${index}`, { method: 'DELETE' })
}

export default function Home() {
  const [list, setList] = useState<Item[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchList().then((res) => {
      setList(res)
    })
  }, [])

  return (
    <>
      <Head>
        <title>Todo List</title>
      </Head>
      <main className="justify-center items-center bg-gradient-to-br to-amber-300 from-orange-300 text-black min-w-full min-h-screen">

        <div className="py-8 mb-20">
          <p className="text-center text-6xl font-semibold text-white">Todo List</p>
        </div>

        <div className="space-x-4 w-full flex justify-center items-center py-4 h-20 mb-16">
          <form className="flex focus-within:outline" onSubmit={async (e) => {
            let element = e.currentTarget;
            e.preventDefault();
            let val = new FormData(element).get('text')!.toString()
            if (val.length === 0) { return; }
            let newTodo = await createTodo(val)
            element.reset()
            setList([...list, newTodo])
          }}>
            <input name='text' className="outline-none w-[60vw] h-12 pl-2 text-3xl" minLength={5} />
            <button type='submit' className="fill-orange-500 bg-white hover:fill-white hover:bg-orange-500 w-12 h-12 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 96 960 960"><path d="M450 776h60V606h170v-60H510V376h-60v170H280v60h170v170ZM180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Z" /></svg>
            </button>
          </form>

          <div className="relative h-12 w-40 bg-white">
            <select value={filter} onChange={e => { setFilter(e.target.value) }} className="appearance-none bg-transparent h-12 pl-2 pr-14 focus:outline cursor-pointer z-20 absolute left-0">
              <option value='all'>All</option>
              <option value='completed'>Completed</option>
              <option value='uncompleted'>Uncompleted</option>
            </select>
            <svg className="absolute bg-orange-500 fill-white top-0 right-0 z-0" xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 96 960 960"><path d="M480 696 280 497h400L480 696Z" /></svg>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">

          {list.map(obj => {
            if (filter === 'completed' && !obj.completed || filter === 'uncompleted' && obj.completed) return null;
            return <div key={obj.index} className="max-w-[80vw] w-full h-12 flex bg-white">
              <p className={`flex-1 text-3xl text-center px-2 ${obj.completed ? 'line-through text-slate-600' : ''}`}>{obj.data}</p>
              <button className={`${obj.completed ? 'bg-white' : 'bg-green-300'} w-12 p-2`} onClick={async () => {
                await updateTodo(obj.index, !obj.completed)
                let newList = list.map(o => o.index === obj.index ? { ...o, completed: !obj.completed } : o)
                setList(newList)
              }}>
                {obj.completed ? undoSVG : checkSVG}
              </button>
              <button className="bg-red-300 w-12 p-2" onClick={async () => {
                await deleteTodo(obj.index)
                setList(list.filter(o => o.index !== obj.index))
              }}>
                {deleteSVG}
              </button>
            </div>
          }
          )}

        </div>
      </main >
    </>
  )
}
