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
            <Card cover={<MemeImage imageUrl={props.meme.imageUrl} title={props.meme.title} />} className={classes.memeCard}>

                <div className={classes.cardBody}>
                    <MemeHeader title={props.meme.title} tags={props.meme.tags} userPath={props.meme.createdBy.path} />
                    <MemeFooter memeId={props.meme.id || ""} />
                </div>

            </Card>
        </div>
    );
});
