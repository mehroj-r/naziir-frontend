import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/store/slices/userSlice";
import { userService } from "@/services/user.service";
import { Box, Grid } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";

export default function MainLayout() {
  const userData = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch()

  useEffect(()=>{
    if (userData.userId && !!userData?.token && !userData.data) {
      userService.getById(userData.userId)
        .then(res => {
          dispatch(userActions.setUserData(res?.data))
        })
    }
  },[userData])

  return(
    <>
      {settings?.isSidebarShown && (
        <Header />
      )}
      <Grid h='calc(100vh - 60px)' templateColumns={settings?.isSidebarShown ? '250px 1fr' : '1fr'}>
        {settings?.isSidebarShown && (
          <Box pl='1px' pb='1px'>
            <Sidebar />
          </Box>
        )}
        <Box overflowY='scroll'>
          <Outlet />
        </Box>
      </Grid>
    </>
  )
}
