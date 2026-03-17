import { ElementType, ComponentPropsWithoutRef } from 'react';
import styles from './Container.module.css';

export type ContainerVariant = 'default' | 'narrow' | 'fluid';

type ContainerOwnProps<E extends ElementType> = {
    /** Rendered HTML element. @default 'div' */
    as?: E;
    variant?: ContainerVariant;
    className?: string;
};

type ContainerProps<E extends ElementType> = ContainerOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof ContainerOwnProps<E>>;

const variantClass: Record<ContainerVariant, string | undefined> = {
    default: undefined,
    narrow: styles['container--narrow'],
    fluid: styles['container--fluid'],
};

export function Container<E extends ElementType = 'div'>({
     as,
     variant = 'default',
     className,
     ...rest
 }: ContainerProps<E>) {
    const Tag = as ?? 'div';

    const cls = [styles.container, variantClass[variant], className]
        .filter(Boolean)
        .join(' ');

    return (
        <Tag
            className={cls}
            {...rest}
        />
    );
}