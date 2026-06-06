"use client"

import { Slider, SliderProps } from "@heroui/slider"


interface HeroSliderProps extends SliderProps{}

export default function HeroSlider(props: HeroSliderProps) {
  return (
    <Slider {...props} />
  )
}