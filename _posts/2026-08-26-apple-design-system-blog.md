---
layout: post
title: "Apple 디자인 시스템으로 블로그 구축하기"
category: "Design System"
date: 2026-08-26 14:00:00 +0900
---

Apple의 Human Interface Guidelines(HIG)와 미니멀리즘 철학을 바탕으로 나만의 정적 블로그 인터페이스를 구축했습니다.

## 핵심 디자인 원칙

1. **단일 액센트 컬러**: 모든 인터랙티브 링크와 버튼에 Action Blue(`#0066cc`)만 사용합니다.
2. **SF Pro 타이포그래피**: 디스플레이 크기에서 음수 자간(Negative Letter-spacing)을 적용하여 정돈된 느낌을 줍니다.
3. **절제된 엘리베이션**: 카드나 버튼에는 그림자를 배제하고, 오직 표면에 놓인 오브젝트에만 부드러운 시그니처 섀도우를 적용합니다.

```python
# Aerospace & Control Systems Sample Code
def satellite_attitude_control(quaternion, angular_velocity):
    # Proportional-Derivative (PD) Control Law
    torque = -kp * quaternion.vector - kd * angular_velocity
    return torque
```

앞으로 항공우주 제어 시스템, 임베디드 소프트웨어, 그리고 AI에 관한 탐구 기록을 이 공간에 남길 예정입니다.
