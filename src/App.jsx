import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Note from "./Note"
import ShareView from "./ShareView"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Note />} />
        <Route path="/share/:id" element={<ShareView />} />
      </Routes>
    </BrowserRouter>
  )
}
