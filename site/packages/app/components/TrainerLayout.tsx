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
import { NavBar } from 'app/components/NavBar'
import { useIsMobile } from 'app/utils/isMobile'

export const TrainerLayout = ({ chessboard, children }: any) => {
  const isMobile = useIsMobile()
  return (
    <View style={s(c.column, c.minHeight('100vh'))}>
      <NavBar />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'none'
        }}
      >
        <View
          style={s(
            c.fullWidth,
            !isMobile && c.center,
            !isMobile && c.minWidth('100vw'),
            !isMobile && c.mt(48),
            isMobile && c.px(10),
            isMobile && c.pt(10)
          )}
        >
          <View
            style={s(
              isMobile && s(c.alignCenter),
              isMobile ? c.column : s(c.row, c.alignCenter)
            )}
          >
            <View style={s(c.width(500), c.maxWidth('100%'))}>
              {chessboard}
            </View>
            <Spacer height={12} width={24} isMobile={isMobile} />
            <View style={s(c.column, c.maxWidth(400), c.fullWidth)}>
              {children}
            </View>
          </View>
        </View>
      </View>
      <View style={s(c.fullWidth, c.height(48), c.bg(c.grays[40]), c.center)}>
        <Text style={c.fg(c.grays[90])}>
          If you have any feedback or suggestions, feel free to email me at{' '}
          <a
            style={s(
              c.keyedProp('textDecoration')('none'),
              c.fg(c.grays[90]),
              c.weightBold
            )}
            href="mailto:me@mbuffett.com"
          >
            me@mbuffett.com
          </a>
        </Text>
      </View>
    </View>
  )
}