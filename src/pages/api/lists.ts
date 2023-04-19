// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// Storing data in a variable on the node server rather a DB, for the sake of presentation
let _index = 0;
const items: Item[] = []

export interface Item {
  index: number;

  data: string;
  completed: boolean;
}

interface IRequest<Body = string | Item | any> extends NextApiRequest {
  body: Body;
}

type Request<ReqBody = string | Item | any, ResBody = Item | Item[] | any> = (
  req: IRequest<ReqBody>,
  res: NextApiResponse<ResBody>
) => void;


const handler: Request = (req, res) => {
  switch (req.method) {
    case 'GET':
      GET(req, res);
      break;
    case 'POST':
      POST(req, res)
      break;
    case 'PATCH':
      PATCH(req, res)
      break;
    case 'DELETE':
      DELETE(req, res)
      break;
    default:
      res.status(405).end()
  }
}

const GET: Request<any, Item[]> = (req, res) => {
  res.json(items)
}

const POST: Request<string, Item> = (req, res) => {
  if (req.body.length < 5) {
    return res.status(403).end()
  }
  let todo = { index: ++_index, data: req.body, completed: false }
  items.push(todo)
  res.status(201).json(todo)
}

const PATCH: Request<Item, any> = (req, res) => {
  let update = req.body;
  let target = items.findIndex(todo => todo.index === update.index)
  if (target === -1) {
    return res.status(404).end()
  }
  items[target].completed = update.completed
  // items.splice(target, 1, {...items[target], ...update})
  return res.status(200).end()
}

const DELETE: Request = (req, res) => {
  let index = parseInt(req.query.index?.toString() ?? '-1')
  if (index === -1) {
    return res.status(404).end()
  }
  let target = items.findIndex(todo => todo.index === index)
  if (target === -1) {
    return res.status(404).end()
  }
  items.splice(target, 1)
  return res.status(200).end()
}

export default handler;