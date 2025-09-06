import React, { useEffect, useState } from "react"
import axios from "axios"

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
// const API = "https://notes-backend-36sh.onrender.com/"
const API = "https://notes-backend-36sh.onrender.com" || "http://localhost:8080"

export default function Note() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/notes`)
      setNotes(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title.trim()) return
    await axios.post(`${API}/api/notes`, { title, content })
    setTitle(""); setContent("")
    load()
  }

  const update = async (n) => {
    const t = prompt("New title", n.title)
    if (t == null) return
    const c = prompt("New content", n.content ?? "")
    if (c == null) return
    await axios.put(`${API}/api/notes/${n.id}`, { title: t, content: c })
    load()
  }

  const remove = async (id) => {
    await axios.delete(`${API}/api/notes/${id}`)
    load()
  }

  const share = async (id) => {
    try {
      await axios.post(`${API}/api/notes/${id}/share`)
      const res = await axios.get(`${API}/api/notes/${id}`)   // get publicId
      const pid = res.data.publicId
      const frontendLink = `${window.location.origin}/share/${pid}`
      // const frontendLink = `${window.location.origin}/share/${id}`

      setShareUrl(frontendLink)

      // try {
      //   await navigator.clipboard.writeText(frontendLink)
      // } catch {console.warn("Clipboard not supported")}

      // alert("Share link copied:\n" + frontendLink)
    } catch (err) {
      console.error("Error sharing note:", err)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📝 Notes App</h1>

      <div className="bg-white shadow-lg rounded-2xl p-4 mb-6">
        <input
          className="w-full border rounded-lg px-3 py-2 mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-2"
          placeholder="Content"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Note
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {notes.map(n => (
            <div
              key={n.id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold">{n.title}</h2>
              <p className="text-gray-600 whitespace-pre-line">{n.content}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => update(n)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => remove(n.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
                <button
                  onClick={() => share(n.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareUrl && (
        <div className="mt-6 bg-gray-100 rounded-lg p-3">
          <div>
            <strong>Share Link:</strong>{" "}
            <a href={shareUrl} target="_blank" className="text-blue-600 underline">
              {shareUrl}
            </a>
          </div>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareUrl)
                alert("✅ Link copied to clipboard")
              } catch {
                alert("❌ Could not copy link")
              }
            }}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
          Copy
          </button>
        </div> 
      )}
    </div>
  )
}
