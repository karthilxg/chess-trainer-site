import {
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  Modal
} from 'react-native'
import React from 'react'
import { c, s } from 'app/styles'
import { Spacer } from 'app/Space'
import { useRouter } from 'next/router'
import { intersperse } from 'app/utils/intersperse'

const navItems = [
  {
    path: '/',
    title: 'Visualization Trainer'
  },
  {
    path: '/color_trainer',
    title: 'Color Trainer'
  }
]
export const NavBar = (props: {}) => {
  const router = useRouter()
  return (
    <View
      style={s(
        c.row,
        c.px(16),
        c.bg(c.grays[30]),
        c.alignCenter,
        c.justifyCenter,
        c.height(72)
      )}
    >
      {intersperse(
        navItems.map((navItem) => {
          const isActive = router.asPath == navItem.path
          return (
            <Pressable
              style={s(c.clickable)}
              onPress={() => {
                router.push(navItem.path)
              }}
            >
              <Text
                style={s(
                  c.fg(c.colors.textPrimary),
                  c.weightBold,
                  c.fontSize(16),
                  c.pb(4),
                  isActive && s(c.borderBottom(`2px solid ${c.grays[60]}`))
                )}
              >
                {navItem.title}
              </Text>
            </Pressable>
          )
        }),
        (i) => {
          return <Spacer width={24} />
        }
      )}
    </View>
  )
}
