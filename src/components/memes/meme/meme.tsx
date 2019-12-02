import * as React from "react";
import { memo } from "react";
import { MemeProps } from "./meme-props";
import { Card } from "antd";
import { default as classes } from "./meme.module.scss";
import { MemeFooter } from "../meme-footer/meme-footer";
import { MemeImage } from "../meme-image/meme-image";
import { MemeHeader } from "../meme-header/meme-header";

export const Meme: React.FC<MemeProps> = memo((props: MemeProps) => {
    return (
        <div>
            <Card className={classes.memeCard}>
                <MemeHeader title={props.meme.title} tags={props.meme.tags} />

                <MemeImage imageUrl={props.meme.imageUrl} title={props.meme.title} />

                <MemeFooter meme={props.meme} />
            </Card>
        </div>
    );
});
