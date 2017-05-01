let _finalResultTypes = [];

const gigTypes = (str, root) => {
  const json = JSON.parse(str);

  for (let i = 0; i < json.length; i++) { // Array
    if (typeof json[i] === "object") {
      loop(json[i], upperCaseFirst(root));
    }
  }
  displayJsonTypes();
  _finalResultTypes = [];
};

/*
 * @obj: object
 * @interfaceName: obj의 interface 이름, 즉 type이 되는 이름
 *
 * obj의 모든 property를 확인하여 type을 결정한다.
 * property가 object의 경우에는 재귀호출이 발생한다.
 *
 */
const loop = (obj, interfaceName) => {
  let result = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const type = typeof obj[prop];
      const theType = determineType(type, prop);
      Object.defineProperty(result, prop, {
        value: {
          type: theType,
          optional: false
        },
        configurable: true,
        enumerable: true,
        writable: true,
      });
      if (type === "object") {
        loop(obj[prop], theType);
      }
    }
  }

  // 정리된 결과에 optional property 체크를 하고 전역변수에 저장해둔다.
  makeTypes({
    "interfaceName": interfaceName,
    "types": result,
  });

  return result;
};

/*
 * @target: property들이 정의된 object
 *
 * 최종 출력 전에 전달받은 target object에 optional한 property가 있는지 판단하고
 * 정리한 결과를 전역 변수인 _finalResultTypes라는 array에 저장한다.
 */
const makeTypes = target => {
  if (_finalResultTypes.length !== 0) {
    for (let i = 0; i < _finalResultTypes.length; i++) {
      let origin = _finalResultTypes[i];

      if (origin.interfaceName === target.interfaceName) {
        let newCopy = {};
        Object.assign(newCopy, target.types);
        Object.assign(newCopy, origin.types);
        for (let prop in newCopy) {
          if (newCopy.hasOwnProperty(prop)) {
            if (!target.types.hasOwnProperty(prop) ||
              !origin.types.hasOwnProperty(prop)) {

              // optional field setting
              Object.defineProperty(newCopy, prop, {
                value: {
                  type: newCopy[prop].type,
                  optional: true
                },
                configurable: true,
                enumerable: true,
                writable: true,
              });
            }
          }
        }
        origin.types = newCopy;
        return;
      }
    }
  }

  // 첫번째 데이터거나, target object가 처음 등장한 interface name을 갖는 경우,
  // 바로 전역변수에 저장한다.
  _finalResultTypes.push(target);
};

/*
 * 전역변수 _finalResultTypes array에 저장되어 있는 interface type 정보들을
 * 요구사항에 맞는 형식으로 출력한다.
 */
const displayJsonTypes = () => {
  let resultStr = "";

  for (let i = _finalResultTypes.length-1; i >= 0; i--) {
    const item = _finalResultTypes[i];

    for (let prop in item) {
      if (item.hasOwnProperty(prop)) {
        if (prop === "interfaceName") {
          resultStr += (resultStr.length === 0)
            ? "interface "
            : "\n\ninterface ";
          resultStr += item[prop] + " {\n"
        } else if (prop === "types") {
          const types = item[prop];
          let keys = Object.keys(types).sort();

          for (let i = 0; i < keys.length; i++) {
            let type = keys[i];
            resultStr = resultStr
              + "  " + optionalType(type, types[type].optional)
              + ": " + types[type].type + ";\n";
          }
          resultStr += "}"
        }
      }
    }
  }
  console.log(resultStr);
};

/*
 * "I"문자를 접두어로 갖고 str의 맨 앞글자를 대문자로 변경한 새로운 문자열을 반환
 */
const upperCaseFirst = str => (
  "I" + str.charAt(0).toUpperCase() + str.slice(1)
);

/*
 * 해당 property가 optional한 property라면 전달받은 type의 접미어로 "?"를 붙혀서 반환한다.
 * 그 외의 경우에는 전달받은 type을 그대로 반환한다.
 */
const optionalType = (type, optional) => (
  (optional) ? type + "?" : type
);

/*
 * 실제 type과 property name을 인자로 받아서 data의 type이 'object'의 경우,
 * "I"문자를 접두어로 갖고 property name의 맨 앞글자를 대문자로 변경한 새로운 type을
 * 반환하도록 한다.
 * type이 'object'가 아닌경우에는 전달받은 type을 그대로 반환한다.
 */
const determineType = (type, propName) => (
  (type !== "object") ? type : upperCaseFirst(propName)
);

exports.gigTypes = gigTypes;