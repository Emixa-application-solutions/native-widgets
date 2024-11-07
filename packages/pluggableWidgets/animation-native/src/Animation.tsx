import { Component, ReactNode, createElement } from "react";
import { available, flattenStyles } from "@mendix/piw-native-utils-internal";
import { Animation as AnimationType, View, Easing, CustomAnimation } from "react-native-animatable";

import { AnimationProps } from "../typings/AnimationProps";
import { defaultAnimationStyle, AnimationStyle } from "./ui/Styles";
import { executeAction } from "@mendix/piw-utils-internal";

export type Props = AnimationProps<AnimationStyle>;
type Direction = "normal" | "reverse" | "alternate" | "alternate-reverse";

export class Animation extends Component<Props> {
    private readonly animationEndHandle = this.onAnimationEnd.bind(this);
    private readonly styles = flattenStyles(defaultAnimationStyle, this.props.style);

    render(): ReactNode {
        const { count, duration, content, easing, delay, direction, customHeight } = this.props;
        const easingValue = easing.replace(/_/g, "-") as Easing;
        const directionValue = direction.replace(/_/g, "-") as Direction;
        const countValue = count === 0 ? "infinite" : count;
        const customHeightValue = Number(available(customHeight) ? customHeight.value : 0);
        this.validateProps(this.props);

        return (
            <View
                testID={this.props.name}
                animation={this.getAnimation(customHeightValue)}
                duration={duration}
                delay={delay}
                direction={directionValue}
                easing={easingValue}
                iterationCount={countValue}
                onAnimationEnd={this.animationEndHandle}
                style={this.styles.container}
                // useNativeDriver //DV: Removed for custom Animation
            >
                {content}
            </View>
        );
    }

    private validateProps(props: Props): void {
        const { afterAnimationAction, count } = props;
        if (afterAnimationAction && count === 0) {
            this.log("After animation action can not be triggered by infinite count");
        }
        const { animationType, animationIn, animationOut, animationAttention, customHeight } = this.props;
        if (animationType === "in" && animationIn === "none") {
            this.log("No 'Entry animation' is selected for animation type 'Entry'");
        }
        if (animationType === "attention" && animationAttention === "none") {
            this.log("No 'Attention animation' is selected for animation type 'Attention'");
        }
        if (animationType === "out" && animationOut === "none") {
            this.log("No 'Exit animation' is selected for animation type 'Exit'");
        }
        if (animationType === "in" && (animationOut !== "none" || animationAttention !== "none")) {
            this.log(
                "The 'Attention' an 'Exit' animation is ignored and should be set to 'None' when effect 'type' 'Entry' is selected"
            );
        }
        if (animationType === "attention" && (animationOut !== "none" || animationIn !== "none")) {
            this.log(
                "The 'Entrance' and 'Exit' animation is ignored and should be set to 'None' when effect 'type' 'Attention' is selected"
            );
        }
        if (animationType === "out" && (animationIn !== "none" || animationAttention !== "none")) {
            this.log(
                "The 'Entry' and 'Attention' animation is ignored and should be set to 'None' when effect 'type' 'Exit' is selected"
            );
        }
        if (animationType === "out" && animationOut === "custom" && (!available(customHeight) || !customHeight.value)) {
            this.log("The height attribute is required when effect 'type' 'Custom disappear' is selected");
        }
    }

    private log(message: string): void {
        // eslint-disable-next-line no-console
        console.warn(message);
    }

    private getCustomAnimation(customHeight: number): CustomAnimation | undefined {
        //DV: CustomAnimation
        const { condition } = this.props;
        const animation = {
            from: {
                height: customHeight,
                translateY: 0
            },
            to: {
                height: 0,
                translateY: -2 * customHeight
            }
        };

        if (!condition || (condition.status === "available" && condition.value === true)) {
            return animation;
        }
        return undefined;
    }

    private getAnimation(customHeight: number): AnimationType | CustomAnimation | undefined {
        const { animationType, animationIn, animationOut, animationAttention, condition } = this.props;
        const animation = //Return CustomAnimation if custom value is used
            animationType === "in"
                ? animationIn
                : animationType === "out"
                ? animationOut === "custom"
                    ? this.getCustomAnimation(customHeight)
                    : animationOut
                : animationAttention;

        if (!condition || (condition.status === "available" && condition.value === true)) {
            return animation === "none" ? undefined : animation;
        }
        return undefined;
    }

    private onAnimationEnd(): void {
        executeAction(this.props.afterAnimationAction);
    }
}
