import React from "react";
import { SVGProps } from "react";

export const PaymentCardIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" {...props}>
    <path
      d="M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM18 8H2V16H18V8ZM18 6V2H2V6H18ZM12 12H16V14H12V12Z"
      fill="currentColor"
    />
  </svg>
);
export const BillingAddressIcon: React.FC<SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg width="18" height="23" viewBox="0 0 18 23" fill="none" {...props}>
    <path
      d="M8 13V15C6.4087 15 4.88258 15.6321 3.75736 16.7574C2.63214 17.8826 2 19.4087 2 21H0C0 18.8783 0.842855 16.8434 2.34315 15.3431C3.84344 13.8429 5.87827 13 8 13ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10ZM16.828 20.071L14 23L11.172 20.071C9.609 18.453 9.609 15.831 11.172 14.213C11.5366 13.8298 11.9754 13.5248 12.4615 13.3163C12.9476 13.1079 13.4711 13.0004 14 13.0004C14.5289 13.0004 15.0524 13.1079 15.5385 13.3163C16.0246 13.5248 16.4633 13.8298 16.828 14.213C18.391 15.831 18.391 18.453 16.828 20.071ZM15.39 18.681C16.203 17.839 16.203 16.445 15.39 15.603C15.2119 15.4127 14.9966 15.2611 14.7575 15.1574C14.5184 15.0537 14.2606 15.0002 14 15.0002C13.7394 15.0002 13.4816 15.0537 13.2425 15.1574C13.0034 15.2611 12.7881 15.4127 12.61 15.603C11.797 16.445 11.797 17.839 12.61 18.682L14 20.12L15.39 18.68V18.681Z"
      fill="currentColor"
    />
  </svg>
);
export const AddressIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="28" height="26" viewBox="0 0 28 26" fill="none" {...props}>
    <mask
      id="path-1-outside-1_252_5144"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="28"
      height="26"
      fill="black"
    >
      <rect fill="white" width="28" height="26" />
      <path d="M22.1027 23.6667L21.1587 22.7493L23.9253 19.9493H17.436V18.616H23.9253L21.1587 15.816L22.1027 14.8973L26.4867 19.2827L22.1027 23.6667ZM10.4627 16.3333C11.4671 16.3333 12.388 16.1049 13.2253 15.648C14.0636 15.1902 14.7542 14.5813 15.2973 13.8213C14.6049 13.3298 13.8529 12.9591 13.0413 12.7093C12.2289 12.4587 11.3707 12.3333 10.4667 12.3333C9.56267 12.3333 8.70267 12.4587 7.88667 12.7093C7.07156 12.9591 6.31778 13.3293 5.62533 13.82C6.16933 14.5809 6.86 15.1898 7.69733 15.6467C8.53467 16.1044 9.456 16.3333 10.4613 16.3333M10.4613 9.66667C11.024 9.66667 11.4982 9.47378 11.884 9.088C12.2689 8.70311 12.4613 8.22933 12.4613 7.66667C12.4613 7.104 12.2689 6.63022 11.884 6.24533C11.4982 5.85956 11.024 5.66667 10.4613 5.66667C9.89867 5.66667 9.42489 5.85956 9.04 6.24533C8.65422 6.63022 8.46133 7.104 8.46133 7.66667C8.46133 8.22933 8.65422 8.70311 9.04 9.088C9.42489 9.47378 9.89867 9.66667 10.4613 9.66667ZM10.8182 25C7.68485 22.2284 4.968 19.6707 3.38133 17.2733C1.79378 14.876 1 12.6942 1 10.728C1 7.90755 1.91822 5.58133 3.75467 3.74933C5.592 1.91644 7.82755 1 10.4613 1C13.096 1 15.3316 1.91644 17.168 3.74933C19.0044 5.58133 19.9227 7.90755 19.9227 10.728C19.9227 10.912 19.9213 11.1009 19.9187 11.2947C19.9169 11.4876 19.8938 11.6782 19.8493 11.8667H18.4827C18.5271 11.6782 18.556 11.4871 18.5693 11.2933C18.5827 11.1004 18.5893 10.912 18.5893 10.728C18.5893 8.28889 17.8173 6.27556 16.2733 4.688C14.7293 3.10044 12.792 2.30711 10.4613 2.308C8.13155 2.308 6.19467 3.10133 4.65067 4.688C3.10667 6.27467 2.33422 8.288 2.33333 10.728C2.33333 12.3742 3.06133 14.3253 4.51733 16.5813C5.97422 18.8364 7.95555 21.0542 10.4613 23.2347C11.024 22.7564 11.556 22.2653 12.0573 21.7613C12.5596 21.2573 13.036 20.7596 13.4867 20.268L13.6467 20.4013C13.7524 20.4902 13.8631 20.592 13.9787 20.7067C14.0942 20.8204 14.1982 20.9258 14.2907 21.0227L14.4307 21.1693C13.8627 21.7916 13.2458 22.4236 12.58 23.0653C11.9151 23.7071 11.2089 24.3604 10.4613 25.0253" />
    </mask>
    <path
      d="M22.1027 23.6667L21.1587 22.7493L23.9253 19.9493H17.436V18.616H23.9253L21.1587 15.816L22.1027 14.8973L26.4867 19.2827L22.1027 23.6667ZM10.4627 16.3333C11.4671 16.3333 12.388 16.1049 13.2253 15.648C14.0636 15.1902 14.7542 14.5813 15.2973 13.8213C14.6049 13.3298 13.8529 12.9591 13.0413 12.7093C12.2289 12.4587 11.3707 12.3333 10.4667 12.3333C9.56267 12.3333 8.70267 12.4587 7.88667 12.7093C7.07156 12.9591 6.31778 13.3293 5.62533 13.82C6.16933 14.5809 6.86 15.1898 7.69733 15.6467C8.53467 16.1044 9.456 16.3333 10.4613 16.3333M10.4613 9.66667C11.024 9.66667 11.4982 9.47378 11.884 9.088C12.2689 8.70311 12.4613 8.22933 12.4613 7.66667C12.4613 7.104 12.2689 6.63022 11.884 6.24533C11.4982 5.85956 11.024 5.66667 10.4613 5.66667C9.89867 5.66667 9.42489 5.85956 9.04 6.24533C8.65422 6.63022 8.46133 7.104 8.46133 7.66667C8.46133 8.22933 8.65422 8.70311 9.04 9.088C9.42489 9.47378 9.89867 9.66667 10.4613 9.66667ZM10.8182 25C7.68485 22.2284 4.968 19.6707 3.38133 17.2733C1.79378 14.876 1 12.6942 1 10.728C1 7.90755 1.91822 5.58133 3.75467 3.74933C5.592 1.91644 7.82755 1 10.4613 1C13.096 1 15.3316 1.91644 17.168 3.74933C19.0044 5.58133 19.9227 7.90755 19.9227 10.728C19.9227 10.912 19.9213 11.1009 19.9187 11.2947C19.9169 11.4876 19.8938 11.6782 19.8493 11.8667H18.4827C18.5271 11.6782 18.556 11.4871 18.5693 11.2933C18.5827 11.1004 18.5893 10.912 18.5893 10.728C18.5893 8.28889 17.8173 6.27556 16.2733 4.688C14.7293 3.10044 12.792 2.30711 10.4613 2.308C8.13155 2.308 6.19467 3.10133 4.65067 4.688C3.10667 6.27467 2.33422 8.288 2.33333 10.728C2.33333 12.3742 3.06133 14.3253 4.51733 16.5813C5.97422 18.8364 7.95555 21.0542 10.4613 23.2347C11.024 22.7564 11.556 22.2653 12.0573 21.7613C12.5596 21.2573 13.036 20.7596 13.4867 20.268L13.6467 20.4013C13.7524 20.4902 13.8631 20.592 13.9787 20.7067C14.0942 20.8204 14.1982 20.9258 14.2907 21.0227L14.4307 21.1693C13.8627 21.7916 13.2458 22.4236 12.58 23.0653C11.9151 23.7071 11.2089 24.3604 10.4613 25.0253"
      fill="currentColor"
    />
    <path
      d="M22.1027 23.6667L21.7542 24.0252L22.1077 24.3687L22.4562 24.0202L22.1027 23.6667ZM21.1587 22.7493L20.803 22.3979L20.4486 22.7565L20.8102 23.1079L21.1587 22.7493ZM23.9253 19.9493L24.281 20.3008L25.1223 19.4493H23.9253V19.9493ZM17.436 19.9493H16.936V20.4493H17.436V19.9493ZM17.436 18.616V18.116H16.936V18.616H17.436ZM23.9253 18.616V19.116H25.1223L24.281 18.2646L23.9253 18.616ZM21.1587 15.816L20.81 15.4577L20.4489 15.809L20.803 16.1674L21.1587 15.816ZM22.1027 14.8973L22.4563 14.5438L22.1075 14.1949L21.754 14.539L22.1027 14.8973ZM26.4867 19.2827L26.8402 19.6362L27.1937 19.2827L26.8403 18.9292L26.4867 19.2827ZM13.2253 15.648L13.4648 16.0869L13.465 16.0868L13.2253 15.648ZM15.2973 13.8213L15.7041 14.112L15.9958 13.704L15.5868 13.4136L15.2973 13.8213ZM13.0413 12.7093L12.8939 13.1871L12.8943 13.1872L13.0413 12.7093ZM7.88667 12.7093L8.03316 13.1874L8.03349 13.1873L7.88667 12.7093ZM5.62533 13.82L5.33625 13.412L4.92657 13.7023L5.21859 14.1108L5.62533 13.82ZM7.69733 15.6467L7.93718 15.2079L7.93682 15.2078L7.69733 15.6467ZM11.884 9.088L11.5304 8.73445L11.884 9.088ZM11.884 6.24533L11.5304 6.59889L11.884 6.24533ZM9.04 6.24533L9.39315 6.59929L9.39396 6.59848L9.04 6.24533ZM9.04 9.088L9.39396 8.73485L9.39314 8.73404L9.04 9.088ZM3.38133 17.2733L3.79828 16.9974L3.79821 16.9973L3.38133 17.2733ZM3.75467 3.74933L4.10779 4.10331H4.10779L3.75467 3.74933ZM17.168 3.74933L16.8148 4.10323L16.8149 4.10331L17.168 3.74933ZM19.9187 11.2947L19.4187 11.2878L19.4187 11.2901L19.9187 11.2947ZM19.8493 11.8667V12.3667H20.2451L20.336 11.9814L19.8493 11.8667ZM18.4827 11.8667L17.996 11.7519L17.851 12.3667H18.4827V11.8667ZM18.5693 11.2933L18.0705 11.2589L18.0705 11.259L18.5693 11.2933ZM10.4613 2.308V2.808L10.4615 2.808L10.4613 2.308ZM2.33333 10.728L1.83333 10.7278V10.728H2.33333ZM4.51733 16.5813L4.09723 16.8525L4.09735 16.8527L4.51733 16.5813ZM10.4613 23.2347L10.1331 23.6119L10.4575 23.8941L10.7851 23.6157L10.4613 23.2347ZM12.0573 21.7613L11.7032 21.4084L11.7028 21.4087L12.0573 21.7613ZM13.4867 20.268L13.8068 19.8839L13.4404 19.5786L13.1181 19.9301L13.4867 20.268ZM13.6467 20.4013L13.9683 20.0185L13.9668 20.0172L13.6467 20.4013ZM13.9787 20.7067L13.6265 21.0616L13.6279 21.0629L13.9787 20.7067ZM14.2907 21.0227L13.9289 21.3678L13.929 21.3679L14.2907 21.0227ZM14.4307 21.1693L14.7999 21.5064L15.1146 21.1617L14.7923 20.8241L14.4307 21.1693ZM12.58 23.0653L12.233 22.7053L12.2328 22.7056L12.58 23.0653ZM22.4511 23.3081L21.5071 22.3907L20.8102 23.1079L21.7542 24.0252L22.4511 23.3081ZM21.5143 23.1008L24.281 20.3008L23.5697 19.5979L20.803 22.3979L21.5143 23.1008ZM23.9253 19.4493H17.436V20.4493H23.9253V19.4493ZM17.936 19.9493V18.616H16.936V19.9493H17.936ZM17.436 19.116H23.9253V18.116H17.436V19.116ZM24.281 18.2646L21.5143 15.4646L20.803 16.1674L23.5697 18.9674L24.281 18.2646ZM21.5074 16.1743L22.4514 15.2557L21.754 14.539L20.81 15.4577L21.5074 16.1743ZM21.7491 15.2508L26.1331 19.6362L26.8403 18.9292L22.4563 14.5438L21.7491 15.2508ZM26.1331 18.9291L21.7491 23.3131L22.4562 24.0202L26.8402 19.6362L26.1331 18.9291ZM10.4627 16.8333C11.5462 16.8333 12.5501 16.586 13.4648 16.0869L12.9858 15.2091C12.2259 15.6237 11.388 15.8333 10.4627 15.8333V16.8333ZM13.465 16.0868C14.3678 15.5937 15.1162 14.9348 15.7041 14.112L14.8905 13.5306C14.3923 14.2279 13.7593 14.7867 12.9857 15.2092L13.465 16.0868ZM15.5868 13.4136C14.8509 12.8912 14.0509 12.4969 13.1884 12.2315L12.8943 13.1872C13.6549 13.4213 14.3589 13.7683 15.0079 14.229L15.5868 13.4136ZM13.1887 12.2316C12.3256 11.9653 11.4175 11.8333 10.4667 11.8333V12.8333C11.3239 12.8333 12.1322 12.9521 12.8939 13.1871L13.1887 12.2316ZM10.4667 11.8333C9.51584 11.8333 8.60615 11.9653 7.73984 12.2314L8.03349 13.1873C8.79919 12.9521 9.60949 12.8333 10.4667 12.8333V11.8333ZM7.74017 12.2313C6.87434 12.4966 6.07239 12.8904 5.33625 13.412L5.91441 14.228C6.56317 13.7683 7.26877 13.4216 8.03316 13.1874L7.74017 12.2313ZM5.21859 14.1108C5.80735 14.9343 6.55566 15.5933 7.45784 16.0856L7.93682 15.2078C7.16434 14.7863 6.53132 14.2275 6.03207 13.5292L5.21859 14.1108ZM7.45748 16.0854C8.37233 16.5855 9.37681 16.8333 10.4613 16.8333V15.8333C9.53518 15.8333 8.697 15.6233 7.93718 15.2079L7.45748 16.0854ZM10.4613 10.1667C11.152 10.1667 11.7548 9.92433 12.2376 9.44155L11.5304 8.73445C11.2417 9.02322 10.896 9.16667 10.4613 9.16667V10.1667ZM12.2376 9.44155C12.7197 8.95942 12.9613 8.35694 12.9613 7.66667H11.9613C11.9613 8.10172 11.8181 8.4468 11.5304 8.73445L12.2376 9.44155ZM12.9613 7.66667C12.9613 6.97639 12.7197 6.37391 12.2376 5.89178L11.5304 6.59889C11.8181 6.88653 11.9613 7.23161 11.9613 7.66667H12.9613ZM12.2376 5.89178C11.7548 5.409 11.152 5.16667 10.4613 5.16667V6.16667C10.896 6.16667 11.2417 6.31011 11.5304 6.59889L12.2376 5.89178ZM10.4613 5.16667C9.77069 5.16667 9.16809 5.40903 8.68604 5.89219L9.39396 6.59848C9.68169 6.31008 10.0266 6.16667 10.4613 6.16667V5.16667ZM8.68685 5.89137C8.20369 6.37342 7.96133 6.97602 7.96133 7.66667H8.96133C8.96133 7.23198 9.10475 6.88702 9.39314 6.59929L8.68685 5.89137ZM7.96133 7.66667C7.96133 8.35731 8.20369 8.95991 8.68685 9.44196L9.39314 8.73404C9.10475 8.44631 8.96133 8.10135 8.96133 7.66667H7.96133ZM8.68604 9.44114C9.16809 9.9243 9.77069 10.1667 10.4613 10.1667V9.16667C10.0266 9.16667 9.68169 9.02325 9.39396 8.73485L8.68604 9.44114ZM11.1495 24.6255C8.00929 21.8479 5.34297 19.3313 3.79828 16.9974L2.96438 17.5493C4.59303 20.01 7.36041 22.609 10.4869 25.3745L11.1495 24.6255ZM3.79821 16.9973C2.24113 14.646 1.5 12.5604 1.5 10.728H0.5C0.5 12.828 1.34642 15.106 2.96445 17.5494L3.79821 16.9973ZM1.5 10.728C1.5 8.02759 2.37406 5.83285 4.10779 4.10331L3.40154 3.39535C1.46239 5.32981 0.5 7.78752 0.5 10.728H1.5ZM4.10779 4.10331C5.84984 2.36548 7.95775 1.5 10.4613 1.5V0.5C7.69736 0.5 5.33416 1.46741 3.40154 3.39535L4.10779 4.10331ZM10.4613 1.5C12.9659 1.5 15.0737 2.36551 16.8148 4.10323L17.5212 3.39544C15.5894 1.46738 13.2261 0.5 10.4613 0.5V1.5ZM16.8149 4.10331C18.5486 5.83285 19.4227 8.02759 19.4227 10.728H20.4227C20.4227 7.78752 19.4603 5.32981 17.5211 3.39535L16.8149 4.10331ZM19.4227 10.728C19.4227 10.9096 19.4214 11.0962 19.4187 11.2878L20.4186 11.3015C20.4213 11.1056 20.4227 10.9144 20.4227 10.728H19.4227ZM19.4187 11.2901C19.4173 11.4457 19.3986 11.5994 19.3627 11.7519L20.336 11.9814C20.3889 11.757 20.4165 11.5294 20.4186 11.2993L19.4187 11.2901ZM19.8493 11.3667H18.4827V12.3667H19.8493V11.3667ZM18.9693 11.9814C19.02 11.7665 19.053 11.5485 19.0682 11.3277L18.0705 11.259C18.059 11.4258 18.0342 11.59 17.996 11.7519L18.9693 11.9814ZM19.0681 11.3278C19.0822 11.124 19.0893 10.9241 19.0893 10.728H18.0893C18.0893 10.8999 18.0831 11.0769 18.0705 11.2589L19.0681 11.3278ZM19.0893 10.728C19.0893 8.17312 18.2761 6.03015 16.6318 4.3394L15.9149 5.0366C17.3585 6.52096 18.0893 8.40465 18.0893 10.728H19.0893ZM16.6318 4.3394C14.9882 2.64947 12.919 1.80706 10.4611 1.808L10.4615 2.808C12.665 2.80716 14.4705 3.55141 15.9149 5.0366L16.6318 4.3394ZM10.4613 1.808C8.00447 1.808 5.93582 2.65039 4.29233 4.3393L5.00901 5.0367C6.45351 3.55228 8.25864 2.808 10.4613 2.808V1.808ZM4.29233 4.3393C2.64788 6.02919 1.83426 8.17216 1.83333 10.7278L2.83333 10.7282C2.83418 8.40383 3.56545 6.52014 5.00901 5.0367L4.29233 4.3393ZM1.83333 10.728C1.83333 12.5135 2.61883 14.5618 4.09723 16.8525L4.93744 16.3102C3.50384 14.0889 2.83333 12.2349 2.83333 10.728H1.83333ZM4.09735 16.8527C5.5849 19.1552 7.59996 21.4076 10.1331 23.6119L10.7896 22.8575C8.31115 20.7009 6.36354 18.5177 4.93731 16.31L4.09735 16.8527ZM10.7851 23.6157C11.358 23.1287 11.9003 22.6282 12.4118 22.1139L11.7028 21.4087C11.2117 21.9025 10.69 22.3841 10.1375 22.8537L10.7851 23.6157ZM12.4115 22.1143C12.9183 21.6057 13.3996 21.1029 13.8552 20.6059L13.1181 19.9301C12.6724 20.4162 12.2008 20.909 11.7032 21.4084L12.4115 22.1143ZM13.1666 20.6521L13.3266 20.7854L13.9668 20.0172L13.8068 19.8839L13.1666 20.6521ZM13.325 20.7841C13.4186 20.8628 13.519 20.955 13.6265 21.0616L14.3309 20.3517C14.2072 20.229 14.0863 20.1177 13.9683 20.0185L13.325 20.7841ZM13.6279 21.0629C13.7405 21.1738 13.8407 21.2754 13.9289 21.3678L14.6524 20.6775C14.5557 20.5762 14.448 20.4671 14.3295 20.3504L13.6279 21.0629ZM13.929 21.3679L14.069 21.5146L14.7923 20.8241L14.6523 20.6774L13.929 21.3679ZM14.0614 20.8322C13.5012 21.4459 12.8918 22.0703 12.233 22.7053L12.927 23.4253C13.5997 22.7769 14.2241 22.1372 14.7999 21.5064L14.0614 20.8322ZM12.2328 22.7056C11.5731 23.3423 10.8719 23.991 10.129 24.6517L10.7936 25.3989C11.5458 24.7299 12.2571 24.0719 12.9272 23.4251L12.2328 22.7056Z"
      fill="currentColor"
      mask="url(#path-1-outside-1_252_5144)"
    />
  </svg>
);
export const BillingHistoryIcon: React.FC<SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10H2C2 14.418 5.582 18 10 18C14.418 18 18 14.418 18 10C18 5.582 14.418 2 10 2C7.536 2 5.332 3.114 3.865 4.865L6 7H0V1L2.447 3.446C4.28 1.336 6.984 0 10 0ZM11 5V9.585L14.243 12.828L12.828 14.243L9 10.413V5H11Z"
      fill="currentColor"
    />
  </svg>
);
export const GoogleIntegrationIcon: React.FC<SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_7218_18082)">
      <path
        d="M9.75405 0.921086C6.95642 1.89161 4.54374 3.7337 2.87041 6.17678C1.19707 8.61986 0.351282 11.5352 0.457268 14.4944C0.563254 17.4537 1.61543 20.3011 3.45925 22.6182C5.30307 24.9353 7.84134 26.6001 10.7012 27.368C13.0198 27.9662 15.449 27.9925 17.78 27.4445C19.8916 26.9702 21.8439 25.9556 23.4456 24.5001C25.1127 22.939 26.3227 20.9531 26.9456 18.7558C27.6227 16.3663 27.7432 13.8534 27.2978 11.4101H14.2778V16.8111H21.8181C21.6674 17.6725 21.3445 18.4947 20.8686 19.2283C20.3928 19.962 19.7738 20.5922 19.0487 21.0811C18.128 21.6902 17.09 22.1 16.0016 22.2842C14.9099 22.4872 13.7901 22.4872 12.6984 22.2842C11.592 22.0554 10.5453 21.5988 9.62499 20.9433C8.14656 19.8967 7.03647 18.41 6.45311 16.6951C5.8599 14.9482 5.8599 13.0543 6.45311 11.3073C6.86836 10.0828 7.55481 8.96788 8.46124 8.04577C9.49853 6.97116 10.8118 6.20302 12.2569 5.82563C13.702 5.44824 15.2231 5.47618 16.6534 5.9064C17.7707 6.24938 18.7925 6.84864 19.6372 7.6564C20.4874 6.81056 21.3361 5.96254 22.1834 5.11234C22.6209 4.65515 23.0978 4.21984 23.5287 3.75171C22.2393 2.55182 20.7259 1.61815 19.075 1.00421C16.0687 -0.0873738 12.7793 -0.116709 9.75405 0.921086Z"
        fill="white"
      />
      <path
        d="M9.75407 0.921172C12.7791 -0.117328 16.0685 -0.0887648 19.075 1.00211C20.7262 1.62022 22.239 2.55838 23.5266 3.76274C23.0891 4.23086 22.6275 4.66836 22.1813 5.12336C21.3325 5.97065 20.4845 6.81503 19.6372 7.65649C18.7925 6.84872 17.7708 6.24947 16.6534 5.90649C15.2236 5.47476 13.7025 5.4452 12.2571 5.82105C10.8116 6.19689 9.4975 6.96362 8.45907 8.03711C7.55265 8.95922 6.86619 10.0741 6.45095 11.2987L1.91626 7.78773C3.5394 4.56896 6.34977 2.10685 9.75407 0.921172Z"
        fill="#E33629"
      />
      <path
        d="M0.713138 11.2657C0.956872 10.0578 1.36152 8.88797 1.91626 7.7876L6.45095 11.3073C5.85773 13.0542 5.85773 14.9481 6.45095 16.6951C4.94012 17.8618 3.42856 19.0343 1.91626 20.2126C0.52753 17.4483 0.103991 14.2987 0.713138 11.2657Z"
        fill="#F8BD00"
      />
      <path
        d="M14.2778 11.4077H27.2978C27.7432 13.851 27.6227 16.3639 26.9456 18.7533C26.3227 20.9506 25.1127 22.9366 23.4456 24.4977C21.9822 23.3558 20.5122 22.2227 19.0487 21.0808C19.7743 20.5914 20.3935 19.9606 20.8694 19.2261C21.3453 18.4916 21.668 17.6687 21.8181 16.8065H14.2778C14.2756 15.0083 14.2778 13.208 14.2778 11.4077Z"
        fill="#587DBD"
      />
      <path
        d="M1.91406 20.2123C3.42635 19.0457 4.93792 17.8732 6.44875 16.6948C7.03327 18.4103 8.14495 19.8971 9.625 20.9429C10.5481 21.5954 11.5971 22.0484 12.705 22.2729C13.7967 22.4759 14.9164 22.4759 16.0081 22.2729C17.0966 22.0887 18.1346 21.6789 19.0553 21.0698C20.5187 22.2117 21.9888 23.3448 23.4522 24.4867C21.8507 25.943 19.8984 26.9583 17.7866 27.4333C15.4556 27.9812 13.0264 27.955 10.7078 27.3567C8.87404 26.8671 7.16116 26.0039 5.67656 24.8214C4.1052 23.5738 2.82178 22.0016 1.91406 20.2123Z"
        fill="#319F43"
      />
    </g>
    <defs>
      <clipPath id="clip0_7218_18082">
        <rect width="28" height="28" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const OutlookIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.6574 7.19287V12.1564L19.3938 13.2484C19.4565 13.2619 19.5213 13.2619 19.5841 13.2484L27.0498 8.21512C27.0443 7.97084 26.9549 7.73588 26.7967 7.54972C26.6384 7.36357 26.4209 7.23756 26.1807 7.19287H17.6574Z"
      fill="#0072C6"
    />
    <path
      d="M17.6574 14.008L19.2406 15.0955C19.3147 15.1408 19.3998 15.1648 19.4866 15.1648C19.5735 15.1648 19.6586 15.1408 19.7327 15.0955C19.4608 15.2595 27.0488 10.2217 27.0488 10.2217V19.344C27.0686 19.5288 27.0478 19.7158 26.9878 19.8917C26.9278 20.0677 26.83 20.2284 26.7014 20.3626C26.5728 20.4969 26.4164 20.6014 26.2432 20.6688C26.0699 20.7363 25.8841 20.7651 25.6985 20.7532H17.6565L17.6574 14.008ZM9.46125 11.7197C9.19821 11.7185 8.93975 11.7885 8.71322 11.9222C8.48668 12.0559 8.3005 12.2483 8.17437 12.4791C7.83006 13.0912 7.66487 13.7877 7.69769 14.4892C7.66191 15.1892 7.82732 15.8849 8.17437 16.4938C8.2999 16.7152 8.48148 16.8997 8.70087 17.0287C8.92026 17.1576 9.16974 17.2266 9.42423 17.2286C9.67872 17.2307 9.92926 17.1657 10.1507 17.0402C10.3721 16.9147 10.5566 16.7331 10.6856 16.5138C11.0295 15.9079 11.1916 15.2156 11.1523 14.52C11.1916 13.8026 11.0349 13.0881 10.6992 12.4529C10.5789 12.2298 10.4001 12.0436 10.182 11.9145C9.96388 11.7853 9.71472 11.718 9.46125 11.7197Z"
      fill="#0072C6"
    />
    <path
      d="M1.95116 4.67172V24.0899L16.723 27.1875V1.8125L1.95116 4.67172ZM11.8365 17.6637C11.5603 18.0533 11.1928 18.3694 10.7663 18.5844C10.3398 18.7994 9.86719 18.9068 9.38966 18.8971C8.92416 18.9054 8.46355 18.8011 8.047 18.5932C7.63046 18.3852 7.2703 18.0797 6.99716 17.7027C6.34942 16.7982 6.02537 15.7019 6.07731 14.5906C6.02234 13.4249 6.35224 12.2734 7.01619 11.3136C7.29618 10.9168 7.66941 10.5949 8.10303 10.3762C8.53666 10.1574 9.0174 10.0487 9.50294 10.0594C9.96501 10.0504 10.4222 10.1549 10.8346 10.3636C11.2469 10.5723 11.6019 10.8789 11.8682 11.2565C12.5095 12.1806 12.8281 13.2904 12.7745 14.4139C12.8312 15.5713 12.5012 16.7146 11.8365 17.6637Z"
      fill="#0072C6"
    />
  </svg>
);
export const SlackIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_7221_18945)">
      <path
        d="M5.74911 17.0268C5.74911 18.573 4.48813 19.8359 2.94175 19.8359C1.39536 19.8359 0.132904 18.573 0.132904 17.0268C0.132904 15.4807 1.39579 14.2178 2.94196 14.2178H5.74933L5.74911 17.0268ZM7.16429 17.0268C7.16429 15.4807 8.42718 14.2178 9.97335 14.2178C11.5195 14.2178 12.7824 15.4804 12.7824 17.0268V24.0584C12.7824 25.6046 11.5197 26.8675 9.97335 26.8675C8.42718 26.8675 7.16429 25.6046 7.16429 24.0584V17.0268Z"
        fill="#DE1C59"
      />
      <path
        d="M9.97335 5.74902C8.42718 5.74902 7.16429 4.48804 7.16429 2.94166C7.16429 1.39527 8.42718 0.132812 9.97335 0.132812C11.5195 0.132812 12.7824 1.3957 12.7824 2.94187V5.74923L9.97335 5.74902ZM9.97335 7.1642C11.5195 7.1642 12.7824 8.42708 12.7824 9.97326C12.7824 11.5194 11.5197 12.7823 9.97335 12.7823H2.94175C1.39558 12.7823 0.132904 11.5196 0.132904 9.97326C0.132904 8.42708 1.39579 7.1642 2.94196 7.1642H9.97335Z"
        fill="#35C5F0"
      />
      <path
        d="M21.2509 9.97326C21.2509 8.42708 22.5119 7.1642 24.0583 7.1642C25.6047 7.1642 26.8673 8.42708 26.8673 9.97326C26.8673 11.5194 25.6044 12.7823 24.0583 12.7823H21.2509V9.97326ZM19.8357 9.97326C19.8357 11.5194 18.5728 12.7823 17.0267 12.7823C15.4805 12.7823 14.2176 11.5196 14.2176 9.97326V2.94166C14.2176 1.39548 15.4803 0.132812 17.0267 0.132812C18.5728 0.132812 19.8357 1.3957 19.8357 2.94187V9.97326Z"
        fill="#2EB57D"
      />
      <path
        d="M17.0267 21.2511C18.5728 21.2511 19.8357 22.512 19.8357 24.0584C19.8357 25.6048 18.5728 26.8675 17.0267 26.8675C15.4805 26.8675 14.2176 25.6046 14.2176 24.0584V21.2511H17.0267ZM17.0267 19.8359C15.4805 19.8359 14.2176 18.573 14.2176 17.0268C14.2176 15.4807 15.4803 14.2178 17.0267 14.2178H24.0583C25.6044 14.2178 26.8673 15.4804 26.8673 17.0268C26.8673 18.573 25.6044 19.8359 24.0583 19.8359H17.0267Z"
        fill="#EBB02E"
      />
    </g>
    <defs>
      <clipPath id="clip0_7221_18945">
        <rect width="27" height="27" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const SlackSettingIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_7221_18913)">
      <path
        d="M5.33405 4.54507C6.36078 3.62535 7.56673 2.92806 8.87605 2.49707C9.25043 2.96609 9.72571 3.3447 10.2666 3.60474C10.8074 3.86478 11.3999 3.99956 12 3.99907C12.6002 3.99956 13.1927 3.86478 13.7335 3.60474C14.2744 3.3447 14.7497 2.96609 15.124 2.49707C16.4334 2.92806 17.6393 3.62535 18.666 4.54507C18.4476 5.10352 18.3577 5.70401 18.403 6.30196C18.4484 6.89991 18.6278 7.47997 18.928 7.99907C19.2276 8.51916 19.6406 8.96502 20.1363 9.30349C20.632 9.64196 21.1976 9.86433 21.791 9.95407C22.0716 11.303 22.0716 12.6952 21.791 14.0441C20.6311 14.2221 19.561 14.9041 18.928 15.9991C18.6277 16.5183 18.4481 17.0985 18.4028 17.6967C18.3574 18.2948 18.4474 18.8955 18.666 19.4541C17.6392 20.3734 16.4333 21.0704 15.124 21.5011C14.7496 21.0322 14.2742 20.6538 13.7334 20.394C13.1925 20.1341 12.6001 19.9995 12 20.0001C11.3999 19.9996 10.8074 20.1344 10.2666 20.3944C9.72571 20.6544 9.25043 21.033 8.87605 21.5021C7.56682 21.0714 6.36087 20.3744 5.33405 19.4551C5.5527 18.8965 5.64269 18.2958 5.59733 17.6977C5.55197 17.0995 5.37243 16.5193 5.07205 16.0001C4.77234 15.4802 4.3593 15.0345 3.86363 14.6962C3.36797 14.3579 2.80242 14.1357 2.20905 14.0461C1.92836 12.6968 1.92836 11.3043 2.20905 9.95507C2.80251 9.86533 3.36811 9.64296 3.86379 9.30449C4.35946 8.96602 4.77245 8.52016 5.07205 8.00007C5.37228 7.48097 5.55173 6.90091 5.59709 6.30296C5.64245 5.70501 5.55254 5.10452 5.33405 4.54607V4.54507ZM13.5 14.5971C13.844 14.4015 14.1458 14.1399 14.3883 13.8272C14.6307 13.5145 14.8088 13.157 14.9125 12.7751C15.0161 12.3933 15.0433 11.9948 14.9923 11.6024C14.9413 11.2101 14.8132 10.8317 14.6153 10.4891C14.4175 10.1465 14.1539 9.84634 13.8396 9.60601C13.5253 9.36569 13.1666 9.1899 12.7841 9.08877C12.4016 8.98765 12.0029 8.96318 11.6109 9.01678C11.2189 9.07037 10.8414 9.20098 10.5 9.40107C9.81663 9.80172 9.31942 10.4564 9.11694 11.2223C8.91445 11.9882 9.02312 12.8031 9.41923 13.4892C9.81533 14.1752 10.4667 14.6768 11.2313 14.8843C11.9958 15.0919 12.8114 14.9886 13.5 14.5971Z"
        fill="#4F46E5"
      />
    </g>
    <defs>
      <clipPath id="clip0_7221_18913">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const DeleteIntegration: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="30" height="30" rx="15" fill="#EDEDFC" />
    <g clip-path="url(#clip0_7302_20336)">
      <path
        d="M11.6668 9.66683V8.3335H18.3335V9.66683H21.6668V11.0002H20.3335V21.0002C20.3335 21.177 20.2633 21.3465 20.1382 21.4716C20.0132 21.5966 19.8436 21.6668 19.6668 21.6668H10.3335C10.1567 21.6668 9.98712 21.5966 9.86209 21.4716C9.73707 21.3465 9.66683 21.177 9.66683 21.0002V11.0002H8.3335V9.66683H11.6668ZM11.0002 11.0002V20.3335H19.0002V11.0002H11.0002ZM13.0002 13.0002H14.3335V18.3335H13.0002V13.0002ZM15.6668 13.0002H17.0002V18.3335H15.6668V13.0002Z"
        fill="#4F46E5"
      />
    </g>
    <defs>
      <clipPath id="clip0_7302_20336">
        <rect width="16" height="16" fill="white" transform="translate(7 7)" />
      </clipPath>
    </defs>
  </svg>
);
export const SlckListSetting: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="30" height="30" rx="15" fill="#EDEDFC" />
    <g clip-path="url(#clip0_7302_20475)">
      <path
        d="M8.47534 16.3733C8.28361 15.4678 8.28361 14.5322 8.47534 13.6267C9.21534 13.7133 9.862 13.4687 10.0727 12.9593C10.284 12.4493 10.0007 11.8193 9.41534 11.3573C9.92003 10.5816 10.5816 9.92003 11.3573 9.41534C11.8187 10 12.4493 10.284 12.9593 10.0727C13.4693 9.86134 13.714 9.21534 13.6267 8.47534C14.5322 8.28361 15.4678 8.28361 16.3733 8.47534C16.2867 9.21534 16.5313 9.862 17.0407 10.0727C17.5507 10.284 18.1807 10.0007 18.6427 9.41534C19.4185 9.92003 20.08 10.5816 20.5847 11.3573C20 11.8187 19.716 12.4493 19.9273 12.9593C20.1387 13.4693 20.7847 13.714 21.5247 13.6267C21.7164 14.5322 21.7164 15.4678 21.5247 16.3733C20.7847 16.2867 20.138 16.5313 19.9273 17.0407C19.716 17.5507 19.9993 18.1807 20.5847 18.6427C20.08 19.4185 19.4185 20.08 18.6427 20.5847C18.1813 20 17.5507 19.716 17.0407 19.9273C16.5307 20.1387 16.286 20.7847 16.3733 21.5247C15.4678 21.7164 14.5322 21.7164 13.6267 21.5247C13.7133 20.7847 13.4687 20.138 12.9593 19.9273C12.4493 19.716 11.8193 19.9993 11.3573 20.5847C10.5816 20.08 9.92003 19.4185 9.41534 18.6427C10 18.1813 10.284 17.5507 10.0727 17.0407C9.86134 16.5307 9.21534 16.286 8.47534 16.3733ZM9.66667 15.14C10.4 15.3433 11.0047 15.808 11.3047 16.5307C11.604 17.254 11.5047 18.0107 11.13 18.672C11.194 18.74 11.26 18.806 11.328 18.87C11.99 18.4953 12.746 18.3967 13.4693 18.6953C14.192 18.9953 14.6567 19.6 14.86 20.3333C14.9533 20.336 15.0467 20.336 15.14 20.3333C15.3433 19.6 15.808 18.9953 16.5307 18.6953C17.254 18.396 18.0107 18.4953 18.672 18.87C18.74 18.806 18.806 18.74 18.87 18.672C18.4953 18.01 18.3967 17.254 18.6953 16.5307C18.9953 15.808 19.6 15.3433 20.3333 15.14C20.336 15.0467 20.336 14.9533 20.3333 14.86C19.6 14.6567 18.9953 14.192 18.6953 13.4693C18.396 12.746 18.4953 11.9893 18.87 11.328C18.8058 11.2603 18.7397 11.1942 18.672 11.13C18.01 11.5047 17.254 11.6033 16.5307 11.3047C15.808 11.0047 15.3433 10.4 15.14 9.66667C15.0467 9.6642 14.9533 9.6642 14.86 9.66667C14.6567 10.4 14.192 11.0047 13.4693 11.3047C12.746 11.604 11.9893 11.5047 11.328 11.13C11.26 11.194 11.194 11.26 11.13 11.328C11.5047 11.99 11.6033 12.746 11.3047 13.4693C11.0047 14.192 10.4 14.6567 9.66667 14.86C9.664 14.9533 9.664 15.0467 9.66667 15.14ZM15 17C14.4696 17 13.9609 16.7893 13.5858 16.4142C13.2107 16.0391 13 15.5304 13 15C13 14.4696 13.2107 13.9609 13.5858 13.5858C13.9609 13.2107 14.4696 13 15 13C15.5304 13 16.0391 13.2107 16.4142 13.5858C16.7893 13.9609 17 14.4696 17 15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17ZM15 15.6667C15.1768 15.6667 15.3464 15.5964 15.4714 15.4714C15.5964 15.3464 15.6667 15.1768 15.6667 15C15.6667 14.8232 15.5964 14.6536 15.4714 14.5286C15.3464 14.4036 15.1768 14.3333 15 14.3333C14.8232 14.3333 14.6536 14.4036 14.5286 14.5286C14.4036 14.6536 14.3333 14.8232 14.3333 15C14.3333 15.1768 14.4036 15.3464 14.5286 15.4714C14.6536 15.5964 14.8232 15.6667 15 15.6667Z"
        fill="#4F46E5"
      />
    </g>
    <defs>
      <clipPath id="clip0_7302_20475">
        <rect width="16" height="16" fill="white" transform="translate(7 7)" />
      </clipPath>
    </defs>
  </svg>
);
