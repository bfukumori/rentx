import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  Calendar as CustomCalendar,
  DateData,
  LocaleConfig,
} from "react-native-calendars";
import { useTheme } from "styled-components/native";

import { Container } from "./styles";
import ptBR from "./localeConfig";
import { generateInterval } from "./generateInterval";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

interface MarkedDatesProps {
  [date: string]: {
    color: string;
    textColor: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  };
}

interface CalendarProps {
  markedDates: MarkedDatesProps;
  onDayPress: (date: DateData) => void;
}

interface DayProps {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

function Calendar({ markedDates, onDayPress }: CalendarProps) {
  const { colors, fonts } = useTheme();
  return (
    <Container>
      <CustomCalendar
        renderArrow={(direction) => (
          <Feather
            size={24}
            color={colors.text}
            name={direction === "left" ? "chevron-left" : "chevron-right"}
          />
        )}
        headerStyle={{
          backgroundColor: colors.background_secondary,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.text_detail,
          paddingBottom: 10,
          marginBottom: 10,
        }}
        theme={{
          textDayFontFamily: fonts.primary_400,
          textDayHeaderFontFamily: fonts.primary_500,
          textDayHeaderFontSize: 10,
          textMonthFontFamily: fonts.secondary_600,
          textMonthFontSize: 20,
          monthTextColor: colors.title,
          arrowStyle: {
            marginHorizontal: -15,
          },
        }}
        firstDay={1}
        minDate={new Date().toDateString()}
        markingType="period"
        markedDates={markedDates}
        onDayPress={onDayPress}
      />
    </Container>
  );
}

export { Calendar, MarkedDatesProps, DayProps, generateInterval };
