'use strict'

/*
En gros, tu peux poster au serveur soit:

1. le svg drette dans le body du post avec content-type = text/plain
2. le svg (champ cnt) et d'autres champs en JSON avec content-type = application/json

*/

// Tu voudras document.querySelector('svg').innertext ou quelque chose comme ça
// au lieu d'un form/textarea pour lire la valeur de cnt
document.querySelector('form').onsubmit = (ev) => {
  ev.preventDefault()
  const fd = new FormData(ev.target)
  const cnt = fd.get('cnt')
  if (!cnt)  throw new Error('Missing cnt!!')
  const keys = Array.from(fd.keys())
  const obj2 = {}
  if (keys.length > 1) keys.forEach((k) => obj2[k] = fd.get(k))
  const obj = (keys.length > 1) && JSON.stringify(obj2)
  // If there's only the cnt field, send it as plain text
  // Otherwise, send it as JSON with other fields
  fetch('/', {
    method: 'post',
    headers: {
      'content-type': obj ? 'application/json' : 'text/plain',
      'accept': 'application/json',
    },
    body: obj || cnt
  })
  .then((res) => {
    if (!res.ok) {
      const err = new Error('Not ok.')
      err.res = res
      throw err
    }
    return res.json()
  })
  // TODO: User feedback in .then() and .catch()
  .then((json) => console.log('JSON', JSON.stringify(json, null, 2)))
  .catch(console.error)
}
