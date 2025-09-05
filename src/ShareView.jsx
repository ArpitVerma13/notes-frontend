import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export default function ShareView() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`${API}/api/notes/${id}`)
        setNote(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!note) return <p className="text-center mt-10">❌ Note not found</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
        <p className="whitespace-pre-line text-gray-700">{note.content}</p>
      </div>
    </div>
  )
}
