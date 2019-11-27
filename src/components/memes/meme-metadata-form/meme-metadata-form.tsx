import * as React from "react";
import { memo, useEffect } from "react";
import { Spin, Input, Form, Icon, Button, Select } from "antd";
import { MemeUploadActions } from "../../../store/actions/meme-upload-actions";
import { ReduxStore } from "../../../types/redux-store";
import useForm from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { FormErrorMessage } from "../../misc/form-error-message/form-error-message";
import { FormHelpers } from "../../../common/helpers/form-helpers";
import { StringHelpers } from "../../../helpers/string-helpers";
import { default as bootstrap } from "../../../common/styles/bootstrapGrid.module.scss";
import { useFirestoreConnect } from "react-redux-firebase";
import { SelectValue } from "antd/lib/select";
import { Tag } from "../../../models/memes/tag";
import { Dispatch } from "redux";
import { MemeMetadata } from "../../../models/memes/meme-metadata";
import { collectionNames } from "../../../common/constants/collection-names";
import { htmlElements } from "../../../common/constants/html-elements";

const { Option } = Select;

export const MemeMetadataForm: React.FC = memo(() => {
    const { register, handleSubmit, errors, getValues, setValue } = useForm<MemeMetadata>({
        mode: "onBlur"
    });

    const memeUploadErrorMessage: string | undefined = useSelector((store: ReduxStore) =>
        store.memeUpload.memeSubmitError && store.memeUpload.memeSubmitError.message);
    const isLoading: boolean = useSelector((store: ReduxStore) => store.memeUpload.isLoading);
    const imageInEdit: boolean = useSelector((store: ReduxStore) => store.memeUpload.isInEdit);
    const imageSrc: string | undefined = useSelector((store: ReduxStore) => store.memeUpload.uploadedImageSrc);
    const firestore: any = useSelector((store: ReduxStore) => store.firestore);
    const tags: Tag[] = firestore.ordered.tags;
    const fetching: boolean = firestore.status.requesting.tags;
    const values: MemeMetadata = getValues();
    const dispatch: Dispatch<any> = useDispatch();

    useFirestoreConnect([
        {
            collection: collectionNames.tags,
            orderBy: ["name", "asc"]
        },
    ]);

    useEffect(() => {
        const tagsPlaceholder = document.querySelector(".ant-select-selection__placeholder");
        if (tagsPlaceholder) {
            tagsPlaceholder.innerHTML = `${htmlElements.tagIcon} Tags`;
        }
    }, [])

    const fields = {
        title: "title",
        tags: "tags",
        image: "image"
    };

    register({ name: fields.tags }, {
        validate: (value: any) => (!!value && value.length > 0) || "Please select at least one tag."
    });

    register({ name: fields.image }, {
        validate: (value: any) => {
            if (imageInEdit) {
                return "Please save or discard your changes first.";
            }

            if (!imageSrc) {
                return "Please upload an image.";
            }

            return true;
        }
    });

    if (memeUploadErrorMessage && isLoading) {
        dispatch(MemeUploadActions.stopLoading());
    }

    function onSubmit(data: MemeMetadata): void {
        console.log(data);
        debugger;
    }

    const children: JSX.Element[] = [];
    if (tags) {
        for (const tag of tags) {
            children.push(<Option key={tag.id}><Icon type="tag" /> {tag.name}</Option>);
        }
    }

    console.log(errors);
    return (
        <Spin spinning={isLoading} delay={100}>
            <form noValidate className={bootstrap.containerFluid} onSubmit={handleSubmit(onSubmit)}>

                <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                    <div className={bootstrap.col12}>
                        <FormErrorMessage showErrorMessage={!!memeUploadErrorMessage} errorMessage={memeUploadErrorMessage} />
                    </div>
                </div>

                <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                    <div className={bootstrap.col12}>
                        <FormErrorMessage showErrorMessage={!!errors.image} errorMessage={errors.image ? errors.image.message : ""} />
                    </div>
                </div>

                <input type="hidden" name="image" />

                <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                    <div className={bootstrap.col12}>
                        <Form.Item
                            validateStatus={errors.title && "error"}
                            help={errors.title && errors.title.message}>
                            <Input
                                onChange={(e) => setValue(fields.title, e.target.value)}
                                value={values.title}
                                prefix={<Icon type="font-size" />}
                                placeholder="Title"
                                name={fields.title}
                                ref={FormHelpers.registerField(register as any, {
                                    required: "Please provide a title.",
                                    maxLength: {
                                        value: 30,
                                        message: "The title must be shorter than 30 chracters"
                                    }
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                    <div className={bootstrap.col12}>
                        <Form.Item
                            validateStatus={errors.tags && "error"}
                            help={errors.tags && errors.tags.message}>
                            <Select
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Tags"
                                onChange={(val: SelectValue) => setValue(fields.tags, val)}
                                optionFilterProp="name"
                                filterOption={(value, option) => {
                                    if (option.props.children) {
                                        return (option.props.children as string).toLowerCase().indexOf(value.toLowerCase()) >= 0;
                                    }
                                    return false;
                                }}
                            >
                                {children}
                            </Select>
                        </Form.Item>

                    </div>
                </div>

                <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                    <div
                        className={StringHelpers.joinClassNames(
                            bootstrap.col12,
                            bootstrap.dFlex,
                            bootstrap.justifyContentCenter)}>
                        <Button icon="enter" type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </div>
            </form>

        </Spin>
    );
});
