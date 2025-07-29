import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
  verifyJSON,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function SettingsTokenType(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    TokenType: '',
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

  async function onSubmit() {
    console.log('inputs:', inputs);
    console.log('inputsRow:', inputsRow);
    const updateArray = compareObjects(inputs, inputsRow);
    console.log('updateArray:', updateArray);
    if (!updateArray.length) {
      return showWarning(t('你似乎并没有修改什么'));
    }
      
    const requestQueue = updateArray.map((item) => {
      return API.put('/api/option/', { key: item.key, value: inputs[item.key] });
    });

    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (res.includes(undefined)) {
          return showError(t('保存失败'));
        }

        for (let i = 0; i < res.length; i++) {
          if (!res[i].data.success) {
            return showError(res[i].data.message);
          }
        }

        showSuccess(t('保存成功'));
        props.refresh();
      })
      .catch((error) => {
        console.error('Unexpected error:', error);
        showError(t('保存失败，请重试'));
      })
      .finally(() => {
        setLoading(false);
      });
    
  }

  useEffect(() => {
    const currentInputs = {};
    for (let key in props.options) {
      if (Object.keys(inputs).includes(key)) {
        currentInputs[key] = props.options[key];
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current.setValues(currentInputs);
  }, [props.options]);

  return (
    <Spin spinning={loading}>
      <Form
        values={inputs}
        getFormApi={(formAPI) => (refForm.current = formAPI)}
        style={{ marginBottom: 15 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Form.TextArea
              label={t('Token类型配置(可以理解为标签)')}
              placeholder={t('为一个 JSON 文本，键为Token类型名称，值为配置信息')}
              extraText={t('Token类型配置，可以在此处新增类型或修改现有类型的配置，格式为 JSON 字符串，例如：[{"type": "TokenTypeIM", "icon": "https://robohash.org/b3eb97dd5f077e45bfb4b514058f91ec?set=set4&bgset=&size=200x200"}]')}
              field={'TokenType'}
              autosize={{ minRows: 6, maxRows: 12 }}
              trigger='blur'
              stopValidateWithError
              rules={[
                {
                  validator: (rule, value) => verifyJSON(value),
                  message: t('不是合法的 JSON 字符串'),
                },
              ]}
              onChange={(value) =>
                setInputs({ ...inputs, TokenType: value })
              }
            />
          </Col>
        </Row>
      </Form>
      <Button onClick={onSubmit}>{t('保存Token类型配置')}</Button>
    </Spin>
  );
}