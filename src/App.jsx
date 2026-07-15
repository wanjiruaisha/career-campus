import { Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticleDetails from "@/pages/ArticleDetails";
import Coaches from "@/pages/Coaches";
import Contact from "@/pages/Contact";
import Bookmarks from "@/pages/Bookmarks";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";


import Dashboard from "@/pages/admin/Dashboard";
import ManageArticles from "@/pages/admin/ManageArticles";
import AddArticle from "@/pages/admin/AddArticle";
import EditArticle from "@/pages/admin/EditArticle";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="articles" element={<ManageArticles />} />
        <Route path="articles/new" element={<AddArticle />} />
        <Route path="articles/edit/:id" element={<EditArticle />} />
      </Route>
    </Routes>
  );
}