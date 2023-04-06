import React from "react";
import { Divider } from "antd";
import Text from "antd/lib/typography/Text";
import { string } from "prop-types";


const TitledDivider = ({ title }) => (
    <Divider>
        <Text strong>{title}</Text>
    </Divider>
)


TitledDivider.propTypes = {
    title: string,
}
TitledDivider.defaultProps = {
    title: '',
}
export default TitledDivider
