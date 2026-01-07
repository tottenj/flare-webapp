declare module '@storybook/react' {
  export type Meta<T = any> = import('@storybook/types').ComponentAnnotations<
    import('@storybook/react').ReactRenderer,
    T
  >;

  export type StoryObj<T = any> = import('@storybook/types').StoryAnnotations<
    import('@storybook/react').ReactRenderer,
    T
  >;
}
