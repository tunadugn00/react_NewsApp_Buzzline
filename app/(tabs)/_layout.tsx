//app\(tabs)\_layout.tsx
import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'
import { DarkModeProvider } from '@/components/DarkModeContext';

const TabLayout = () => {
  return (
    <DarkModeProvider>
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown:false}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs></DarkModeProvider>
  )
}

export default TabLayout