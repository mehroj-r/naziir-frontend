import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/store/slices/userSlice";
import { userService } from "@/services/user.service";

export default function MainLayout() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch()
  console.log("userData", userData) // log

  useEffect(()=>{
    if (userData.userId && !userData.data) {
      userService.getById(userData.userId)
        .then(res => {
          dispatch(userActions.setUserData(res?.data))
        })
    }
  },[userData])

  return(
    <>
      <Header />
      <Outlet />
    </>
  )
}
